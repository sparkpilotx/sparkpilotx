// 工作流执行控制器 - 高级执行接口

import { WorkflowEngine } from './workflow-engine';
import { AIModelExecutor } from './executors/ai-model-executor';
import { DataProcessorExecutor } from './executors/data-processor-executor';
import { createExecutionStoreInstance } from './execution-store';
import { useBusinessStore } from '../stores/business-store';
import type {
  WorkflowEntity,
  WorkflowExecutionEntity,
  AIModelEntity,
  DataProcessorEntity,
} from '../domain/entities';

export class WorkflowExecutor {
  private engine: WorkflowEngine;
  
  constructor() {
    // 初始化执行引擎
    const executionStore = createExecutionStoreInstance();
    this.engine = new WorkflowEngine(executionStore);
    
    // 注册步骤执行器
    this.engine.registerStepExecutor('aiModel', new AIModelExecutor());
    this.engine.registerStepExecutor('dataProcessor', new DataProcessorExecutor());
  }
  
  // 获取当前业务存储状态
  private getBusinessStore() {
    return useBusinessStore.getState();
  }
  
  // 执行当前工作流
  async executeCurrentWorkflow(
    input: Record<string, unknown>,
    onStepStatusUpdate?: (stepId: string, status: { 
      status: 'pending' | 'running' | 'completed' | 'failed';
      progress?: number;
      startTime?: Date;
      error?: string;
    }) => void
  ): Promise<WorkflowExecutionEntity> {
    const { currentWorkflowId, workflows, workflowSteps, aiModels, dataProcessors } = this.getBusinessStore();
    
    if (!currentWorkflowId) {
      throw new Error('No current workflow selected');
    }
    
    const workflow = workflows.get(currentWorkflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${currentWorkflowId}`);
    }
    
    // 构建完整的工作流实体
    const fullWorkflow: WorkflowEntity = {
      ...workflow,
      steps: Array.from(workflowSteps.values()).filter(step => step.workflowId === currentWorkflowId),
      connections: Array.from(this.getBusinessStore().workflowConnections.values()).filter(
        conn => conn.workflowId === currentWorkflowId
      ),
    };
    
    // 收集所有相关实体
    const entities = new Map<string, AIModelEntity | DataProcessorEntity>();
    
    fullWorkflow.steps.forEach(step => {
      if (step.entityType === 'aiModel') {
        const aiModel = aiModels.get(step.entityId);
        if (aiModel) {
          entities.set(step.entityId, aiModel);
        }
      } else if (step.entityType === 'dataProcessor') {
        const processor = dataProcessors.get(step.entityId);
        if (processor) {
          entities.set(step.entityId, processor);
        }
      }
    });
    
    // 执行工作流
    return await this.engine.executeWorkflow(fullWorkflow, entities, input, onStepStatusUpdate);
  }
  
  // 执行指定工作流
  async executeWorkflow(
    workflowId: string,
    input: Record<string, unknown>
  ): Promise<WorkflowExecutionEntity> {
    const { workflows, workflowSteps, workflowConnections, aiModels, dataProcessors } = this.getBusinessStore();
    
    const workflow = workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }
    
    // 构建完整的工作流实体
    const fullWorkflow: WorkflowEntity = {
      ...workflow,
      steps: Array.from(workflowSteps.values()).filter(step => step.workflowId === workflowId),
      connections: Array.from(workflowConnections.values()).filter(
        conn => conn.workflowId === workflowId
      ),
    };
    
    // 收集所有相关实体
    const entities = new Map<string, AIModelEntity | DataProcessorEntity>();
    
    fullWorkflow.steps.forEach(step => {
      if (step.entityType === 'aiModel') {
        const aiModel = aiModels.get(step.entityId);
        if (aiModel) {
          entities.set(step.entityId, aiModel);
        }
      } else if (step.entityType === 'dataProcessor') {
        const processor = dataProcessors.get(step.entityId);
        if (processor) {
          entities.set(step.entityId, processor);
        }
      }
    });
    
    return await this.engine.executeWorkflow(fullWorkflow, entities, input);
  }
  
  // 验证工作流是否可执行
  validateWorkflow(workflowId: string): { valid: boolean; errors: string[] } {
    const { workflows, workflowSteps, workflowConnections, aiModels, dataProcessors } = this.getBusinessStore();
    
    const workflow = workflows.get(workflowId);
    if (!workflow) {
      return { valid: false, errors: [`Workflow not found: ${workflowId}`] };
    }
    
    const errors: string[] = [];
    const steps = Array.from(workflowSteps.values()).filter(step => step.workflowId === workflowId);
    
    // 检查步骤是否有对应的实体
    steps.forEach(step => {
      if (step.entityType === 'aiModel') {
        const aiModel = aiModels.get(step.entityId);
        if (!aiModel) {
          errors.push(`AI Model not found for step ${step.id}: ${step.entityId}`);
        } else if (aiModel.status !== 'active') {
          errors.push(`AI Model is not active for step ${step.id}: ${aiModel.name}`);
        }
      } else if (step.entityType === 'dataProcessor') {
        const processor = dataProcessors.get(step.entityId);
        if (!processor) {
          errors.push(`Data Processor not found for step ${step.id}: ${step.entityId}`);
        } else if (processor.status !== 'active') {
          errors.push(`Data Processor is not active for step ${step.id}: ${processor.name}`);
        }
      }
    });
    
    // 检查循环依赖
    try {
      const connections = Array.from(workflowConnections.values()).filter(
        conn => conn.workflowId === workflowId
      );
      this.detectCircularDependency(steps, connections);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
    
    return { valid: errors.length === 0, errors };
  }
  
  // 检测循环依赖
  private detectCircularDependency(
    steps: Array<{ id: string }>,
    connections: Array<{ sourceStepId: string; targetStepId: string }>
  ): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const adjacencyList = new Map<string, string[]>();
    
    // 构建邻接表
    steps.forEach(step => {
      adjacencyList.set(step.id, []);
    });
    
    connections.forEach(connection => {
      const targets = adjacencyList.get(connection.sourceStepId) || [];
      targets.push(connection.targetStepId);
      adjacencyList.set(connection.sourceStepId, targets);
    });
    
    // DFS检测循环
    const dfs = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) {
        return true; // 发现循环
      }
      
      if (visited.has(nodeId)) {
        return false; // 已访问过，无循环
      }
      
      visited.add(nodeId);
      recursionStack.add(nodeId);
      
      const neighbors = adjacencyList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (dfs(neighbor)) {
          return true;
        }
      }
      
      recursionStack.delete(nodeId);
      return false;
    };
    
    // 检查所有节点
    for (const step of steps) {
      if (dfs(step.id)) {
        throw new Error('Circular dependency detected in workflow');
      }
    }
  }
}

// 创建全局执行器实例
export const workflowExecutor = new WorkflowExecutor(); 