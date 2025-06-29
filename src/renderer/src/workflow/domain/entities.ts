// 业务实体层 - 纯业务逻辑，与UI完全无关

// ========== 节点执行能力基础定义 ==========

export interface ExecutableEntity {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: Date;
  updatedAt: Date;
  // 标识这是一个可执行的实体
  executable: true;
}

export interface NonExecutableEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // 标识这是一个不可执行的实体
  executable: false;
}

// ========== 可执行实体 ==========

export interface AIModelEntity extends ExecutableEntity {
  provider: 'openai' | 'anthropic' | 'google';
  modelId: string;
  configuration: {
    temperature: number;
    maxTokens: number;
    topP?: number;
    frequencyPenalty?: number;
  };
}

export interface DataProcessorEntity extends ExecutableEntity {
  type: 'filter' | 'transform' | 'validate' | 'aggregate';
  inputSchema: string;
  outputSchema: string;
  configuration: Record<string, unknown>;
}

// ========== 不可执行实体 ==========

export interface AnnotationEntity extends NonExecutableEntity {
  content: string;
  annotationType: 'note' | 'warning' | 'info' | 'title';
  style: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    width?: number;
    height?: number;
  };
}

// 联合类型定义所有节点实体
export type NodeEntity = AIModelEntity | DataProcessorEntity | AnnotationEntity;

// ========== 工作流实体 ==========

export interface WorkflowEntity {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  steps: WorkflowStepEntity[];
  connections: WorkflowConnectionEntity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStepEntity {
  id: string;
  workflowId: string;
  entityType: 'aiModel' | 'dataProcessor' | 'annotation';
  entityId: string;
  configuration: Record<string, unknown>;
  position: { x: number; y: number };
  createdAt: Date;
  // 从关联的实体继承执行能力
  executable: boolean;
}

export interface WorkflowConnectionEntity {
  id: string;
  workflowId: string;
  sourceStepId: string;
  targetStepId: string;
  dataMapping: Record<string, string>;
  createdAt: Date;
  // 连接验证：只有可执行步骤之间才能建立执行连接
  connectionType: 'execution' | 'reference';
}

// ========== 工作流执行层实体 ==========

export interface WorkflowExecutionEntity {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  // 只包含可执行步骤的执行图
  executableSteps: string[];
}

export interface StepExecutionEntity {
  id: string;
  executionId: string;
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  metadata: {
    retryCount: number;
    duration?: number;
    resourceUsage?: {
      tokens?: number;
      cost?: number;
    };
  };
  createdAt: Date;
}

export interface ExecutionLogEntity {
  id: string;
  executionId: string;
  stepId?: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
} 