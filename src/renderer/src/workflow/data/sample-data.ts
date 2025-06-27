// 示例业务数据 - 演示纯渲染器架构

import type {
  AIModelEntity,
  DataProcessorEntity,
  WorkflowEntity,
  WorkflowStepEntity,
  WorkflowConnectionEntity,
} from '../domain/entities';

// 示例AI模型
export const sampleAIModels: AIModelEntity[] = [
  {
    id: 'aimodel_1',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    modelId: 'gpt-4-turbo-preview',
    configuration: {
      temperature: 0.7,
      maxTokens: 4096,
      topP: 1.0,
    },
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'aimodel_2',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    modelId: 'claude-3-sonnet-20240229',
    configuration: {
      temperature: 0.5,
      maxTokens: 2048,
    },
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'aimodel_3',
    name: 'Gemini Pro',
    provider: 'google',
    modelId: 'gemini-pro',
    configuration: {
      temperature: 0.3,
      maxTokens: 8192,
      topP: 0.8,
    },
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
  },
];

// 示例数据处理器
export const sampleDataProcessors: DataProcessorEntity[] = [
  {
    id: 'processor_1',
    name: 'Text Filter',
    type: 'filter',
    inputSchema: 'string',
    outputSchema: 'string',
    configuration: {
      minLength: 10,
      maxLength: 1000,
      excludePatterns: ['spam', 'advertisement'],
    },
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'processor_2',
    name: 'JSON Transformer',
    type: 'transform',
    inputSchema: 'object',
    outputSchema: 'object',
    configuration: {
      mapping: {
        'input.name': 'output.fullName',
        'input.age': 'output.userAge',
      },
    },
    status: 'active',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-12'),
  },
];

// 示例工作流
export const sampleWorkflow: WorkflowEntity = {
  id: 'workflow_1',
  name: 'AI Content Pipeline',
  description: 'Process and analyze content using multiple AI models',
  status: 'draft',
  steps: [],
  connections: [],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-25'),
};

// 示例工作流步骤
export const sampleWorkflowSteps: WorkflowStepEntity[] = [
  {
    id: 'step_1',
    workflowId: 'workflow_1',
    entityType: 'dataProcessor',
    entityId: 'processor_1',
    configuration: {},
    position: { x: 100, y: 100 },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'step_2',
    workflowId: 'workflow_1',
    entityType: 'aiModel',
    entityId: 'aimodel_1',
    configuration: {
      prompt: 'Analyze the following text for sentiment and key themes:',
    },
    position: { x: 400, y: 100 },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'step_3',
    workflowId: 'workflow_1',
    entityType: 'aiModel',
    entityId: 'aimodel_2',
    configuration: {
      prompt: 'Provide a summary of the analysis results:',
    },
    position: { x: 700, y: 100 },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'step_4',
    workflowId: 'workflow_1',
    entityType: 'dataProcessor',
    entityId: 'processor_2',
    configuration: {},
    position: { x: 400, y: 300 },
    createdAt: new Date('2024-01-15'),
  },
];

// 示例工作流连接
export const sampleWorkflowConnections: WorkflowConnectionEntity[] = [
  {
    id: 'connection_1',
    workflowId: 'workflow_1',
    sourceStepId: 'step_1',
    targetStepId: 'step_2',
    dataMapping: {
      'output': 'input',
    },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'connection_2',
    workflowId: 'workflow_1',
    sourceStepId: 'step_2',
    targetStepId: 'step_3',
    dataMapping: {
      'analysis': 'input',
    },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'connection_3',
    workflowId: 'workflow_1',
    sourceStepId: 'step_2',
    targetStepId: 'step_4',
    dataMapping: {
      'rawData': 'input',
    },
    createdAt: new Date('2024-01-15'),
  },
]; 