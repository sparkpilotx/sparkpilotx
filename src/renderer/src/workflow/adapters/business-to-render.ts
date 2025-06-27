// 适配器层 - 将业务数据转换为纯视图数据

import type { Node, Edge } from '@xyflow/react';
import type {
  AIModelEntity,
  DataProcessorEntity,
  WorkflowStepEntity,
  WorkflowConnectionEntity,
} from '../domain/entities';

// 纯视图数据接口 - 只包含渲染所需信息
export interface RenderNodeData extends Record<string, unknown> {
  title: string;
  subtitle: string;
  status: 'idle' | 'running' | 'success' | 'error';
  icon: string;
  color: string;
  businessEntityId: string;
  businessEntityType: 'aiModel' | 'dataProcessor';
  // 执行状态
  executionStatus?: 'pending' | 'running' | 'completed' | 'failed';
  executionProgress?: number;
  lastExecutionTime?: string;
}

export interface RenderEdgeData extends Record<string, unknown> {
  label: string;
  color: string;
  animated: boolean;
  businessConnectionId: string;
}

// 严格类型的渲染节点和边
export type RenderNode = Node<RenderNodeData, 'aiModel' | 'dataProcessor'>;
export type RenderEdge = Edge<RenderEdgeData, 'workflow'>;

// 业务实体转换为渲染节点
export function aiModelToRenderNode(
  model: AIModelEntity,
  step: WorkflowStepEntity
): RenderNode {
  return {
    id: step.id,
    type: 'aiModel',
    position: step.position,
    data: {
      title: model.name,
      subtitle: `${model.provider} • ${model.modelId}`,
      status: mapModelStatusToRenderStatus(model.status),
      icon: 'ai',
      color: getProviderColor(model.provider),
      businessEntityId: model.id,
      businessEntityType: 'aiModel',
    },
  };
}

export function dataProcessorToRenderNode(
  processor: DataProcessorEntity,
  step: WorkflowStepEntity
): RenderNode {
  return {
    id: step.id,
    type: 'dataProcessor',
    position: step.position,
    data: {
      title: processor.name,
      subtitle: processor.type,
      status: mapProcessorStatusToRenderStatus(processor.status),
      icon: getProcessorIcon(processor.type),
      color: getProcessorColor(processor.type),
      businessEntityId: processor.id,
      businessEntityType: 'dataProcessor',
    },
  };
}

export function connectionToRenderEdge(
  connection: WorkflowConnectionEntity,
  sourceStep: WorkflowStepEntity,
  targetStep: WorkflowStepEntity
): RenderEdge {
  return {
    id: connection.id,
    source: sourceStep.id,
    target: targetStep.id,
    type: 'workflow',
    data: {
      label: 'Data Flow',
      color: '#10b981',
      animated: true,
      businessConnectionId: connection.id,
    },
  };
}

// 状态映射函数
function mapModelStatusToRenderStatus(
  status: AIModelEntity['status']
): RenderNodeData['status'] {
  switch (status) {
    case 'active': return 'idle';
    case 'inactive': return 'error';
    case 'error': return 'error';
    default: return 'idle';
  }
}

function mapProcessorStatusToRenderStatus(
  status: DataProcessorEntity['status']
): RenderNodeData['status'] {
  switch (status) {
    case 'active': return 'idle';
    case 'inactive': return 'error';
    default: return 'idle';
  }
}

// 样式映射函数
function getProviderColor(provider: AIModelEntity['provider']): string {
  switch (provider) {
    case 'openai': return '#00a67e';
    case 'anthropic': return '#d97706';
    case 'google': return '#4285f4';
    default: return '#6b7280';
  }
}

function getProcessorIcon(type: DataProcessorEntity['type']): string {
  switch (type) {
    case 'filter': return 'filter';
    case 'transform': return 'transform';
    case 'validate': return 'validate';
    case 'aggregate': return 'aggregate';
    default: return 'processor';
  }
}

function getProcessorColor(type: DataProcessorEntity['type']): string {
  switch (type) {
    case 'filter': return '#ef4444';
    case 'transform': return '#8b5cf6';
    case 'validate': return '#10b981';
    case 'aggregate': return '#f59e0b';
    default: return '#6b7280';
  }
} 