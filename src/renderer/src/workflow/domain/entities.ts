// 业务实体层 - 纯业务逻辑，与UI完全无关

export interface AIModelEntity {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google';
  modelId: string;
  configuration: {
    temperature: number;
    maxTokens: number;
    topP?: number;
    frequencyPenalty?: number;
  };
  status: 'active' | 'inactive' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface DataProcessorEntity {
  id: string;
  name: string;
  type: 'filter' | 'transform' | 'validate' | 'aggregate';
  inputSchema: string;
  outputSchema: string;
  configuration: Record<string, unknown>;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

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
  entityType: 'aiModel' | 'dataProcessor';
  entityId: string;
  configuration: Record<string, unknown>;
  position: { x: number; y: number };
  createdAt: Date;
}

export interface WorkflowConnectionEntity {
  id: string;
  workflowId: string;
  sourceStepId: string;
  targetStepId: string;
  dataMapping: Record<string, string>;
  createdAt: Date;
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