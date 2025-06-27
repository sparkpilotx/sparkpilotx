// 工作流执行引擎 - 核心执行逻辑

import type {
  WorkflowEntity,
  WorkflowStepEntity,
  WorkflowConnectionEntity,
  AIModelEntity,
  DataProcessorEntity,
  WorkflowExecutionEntity,
  StepExecutionEntity,
  ExecutionLogEntity,
} from '../domain/entities';

export interface ExecutionContext {
  executionId: string;
  workflowId: string;
  input: Record<string, unknown>;
  stepOutputs: Map<string, Record<string, unknown>>;
  variables: Map<string, unknown>;
}

export interface StepExecutor {
  canExecute(step: WorkflowStepEntity): boolean;
  execute(
    step: WorkflowStepEntity,
    entity: AIModelEntity | DataProcessorEntity,
    context: ExecutionContext
  ): Promise<Record<string, unknown>>;
}

export class WorkflowEngine {
  private stepExecutors = new Map<string, StepExecutor>();
  private executionStore: ExecutionStore;
  
  constructor(executionStore: ExecutionStore) {
    this.executionStore = executionStore;
  }
  
  // 注册步骤执行器
  registerStepExecutor(type: string, executor: StepExecutor): void {
    this.stepExecutors.set(type, executor);
  }
  
  // 执行工作流
  async executeWorkflow(
    workflow: WorkflowEntity,
    entities: Map<string, AIModelEntity | DataProcessorEntity>,
    input: Record<string, unknown>,
    onStepStatusUpdate?: (stepId: string, status: { 
      status: 'pending' | 'running' | 'completed' | 'failed';
      progress?: number;
      startTime?: Date;
      error?: string;
    }) => void
  ): Promise<WorkflowExecutionEntity> {
    // 创建执行记录
    const execution = await this.executionStore.createExecution({
      workflowId: workflow.id,
      status: 'pending',
      startTime: new Date(),
      input,
      createdAt: new Date(),
    });
    
    const executionId = execution.id;
    
    try {
      // 更新状态为运行中
      await this.executionStore.updateExecution(executionId, { status: 'running' });
      
      // 创建执行上下文
      const context: ExecutionContext = {
        executionId,
        workflowId: workflow.id,
        input,
        stepOutputs: new Map(),
        variables: new Map(),
      };
      
      // 构建执行图
      const executionGraph = this.buildExecutionGraph(workflow.steps, workflow.connections);
      
      // 按照拓扑顺序执行
      const result = await this.executeStepsInOrder(executionGraph, entities, context, onStepStatusUpdate);
      
      // 更新执行结果
      await this.executionStore.updateExecution(executionId, {
        status: 'completed',
        endTime: new Date(),
        output: result,
      });
      
      return await this.executionStore.getExecution(executionId);
      
    } catch (error) {
      await this.executionStore.updateExecution(executionId, {
        status: 'failed',
        endTime: new Date(),
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
  
  // 构建执行图（拓扑排序）
  private buildExecutionGraph(
    steps: WorkflowStepEntity[],
    connections: WorkflowConnectionEntity[]
  ): ExecutionNode[] {
    const nodes = new Map<string, ExecutionNode>();
    const inDegree = new Map<string, number>();
    
    // 初始化节点
    steps.forEach(step => {
      nodes.set(step.id, {
        step,
        dependencies: [],
        dependents: [],
      });
      inDegree.set(step.id, 0);
    });
    
    // 构建依赖关系
    connections.forEach(connection => {
      const sourceNode = nodes.get(connection.sourceStepId);
      const targetNode = nodes.get(connection.targetStepId);
      
      if (sourceNode && targetNode) {
        sourceNode.dependents.push(connection.targetStepId);
        targetNode.dependencies.push(connection.sourceStepId);
        inDegree.set(connection.targetStepId, (inDegree.get(connection.targetStepId) || 0) + 1);
      }
    });
    
    // 拓扑排序
    const queue: string[] = [];
    const result: ExecutionNode[] = [];
    
    // 找到所有入度为0的节点
    inDegree.forEach((degree, stepId) => {
      if (degree === 0) {
        queue.push(stepId);
      }
    });
    
    while (queue.length > 0) {
      const currentStepId = queue.shift()!;
      const currentNode = nodes.get(currentStepId)!;
      result.push(currentNode);
      
      // 减少依赖节点的入度
      currentNode.dependents.forEach(dependentId => {
        const newDegree = (inDegree.get(dependentId) || 0) - 1;
        inDegree.set(dependentId, newDegree);
        
        if (newDegree === 0) {
          queue.push(dependentId);
        }
      });
    }
    
    // 检查是否有循环依赖
    if (result.length !== steps.length) {
      throw new Error('Circular dependency detected in workflow');
    }
    
    return result;
  }
  
  // 按顺序执行步骤
  private async executeStepsInOrder(
    executionGraph: ExecutionNode[],
    entities: Map<string, AIModelEntity | DataProcessorEntity>,
    context: ExecutionContext,
    onStepStatusUpdate?: (stepId: string, status: { 
      status: 'pending' | 'running' | 'completed' | 'failed';
      progress?: number;
      startTime?: Date;
      error?: string;
    }) => void
  ): Promise<Record<string, unknown>> {
    let finalOutput: Record<string, unknown> = {};
    
    for (const node of executionGraph) {
      const step = node.step;
      const entity = entities.get(step.entityId);
      
      if (!entity) {
        throw new Error(`Entity not found for step ${step.id}: ${step.entityId}`);
      }
      
      // 报告步骤开始执行
      const startTime = new Date();
      onStepStatusUpdate?.(step.id, {
        status: 'running',
        startTime,
        progress: 0,
      });

      // 创建步骤执行记录
      const stepExecution = await this.executionStore.createStepExecution({
        executionId: context.executionId,
        stepId: step.id,
        status: 'running',
        startTime,
        metadata: { retryCount: 0 },
        createdAt: new Date(),
      });
      
      try {
        // 准备输入数据
        const stepInput = this.prepareStepInput(step, context);
        
        // 执行步骤
        const executor = this.stepExecutors.get(step.entityType);
        if (!executor) {
          throw new Error(`No executor found for step type: ${step.entityType}`);
        }
        
        const stepOutput = await executor.execute(step, entity, {
          ...context,
          stepOutputs: new Map(context.stepOutputs),
        });
        
        // 保存输出
        context.stepOutputs.set(step.id, stepOutput);
        finalOutput = { ...finalOutput, ...stepOutput };
        
        // 报告步骤完成
        onStepStatusUpdate?.(step.id, {
          status: 'completed',
          startTime,
          progress: 100,
        });

        // 更新步骤执行状态
        await this.executionStore.updateStepExecution(stepExecution.id, {
          status: 'completed',
          endTime: new Date(),
          input: stepInput,
          output: stepOutput,
        });
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // 报告步骤失败
        onStepStatusUpdate?.(step.id, {
          status: 'failed',
          startTime,
          error: errorMessage,
        });

        await this.executionStore.updateStepExecution(stepExecution.id, {
          status: 'failed',
          endTime: new Date(),
          error: errorMessage,
        });
        throw error;
      }
    }
    
    return finalOutput;
  }
  
  // 准备步骤输入数据
  private prepareStepInput(
    step: WorkflowStepEntity,
    context: ExecutionContext
  ): Record<string, unknown> {
    // 从依赖步骤收集输入数据
    const stepInput: Record<string, unknown> = { ...context.input };
    
    // 这里可以根据 dataMapping 来映射数据
    // 简化版本：直接合并所有前置步骤的输出
    context.stepOutputs.forEach((output, stepId) => {
      stepInput[`step_${stepId}`] = output;
    });
    
    return stepInput;
  }
}

// 执行图节点
interface ExecutionNode {
  step: WorkflowStepEntity;
  dependencies: string[];
  dependents: string[];
}

// 执行存储接口
export interface ExecutionStore {
  createExecution(execution: Omit<WorkflowExecutionEntity, 'id'>): Promise<WorkflowExecutionEntity>;
  updateExecution(id: string, updates: Partial<WorkflowExecutionEntity>): Promise<void>;
  getExecution(id: string): Promise<WorkflowExecutionEntity>;
  
  createStepExecution(stepExecution: Omit<StepExecutionEntity, 'id'>): Promise<StepExecutionEntity>;
  updateStepExecution(id: string, updates: Partial<StepExecutionEntity>): Promise<void>;
  
  createLog(log: Omit<ExecutionLogEntity, 'id'>): Promise<ExecutionLogEntity>;
} 