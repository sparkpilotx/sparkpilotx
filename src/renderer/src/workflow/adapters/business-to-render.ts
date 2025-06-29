// 适配器层 - 将业务数据转换为纯视图数据

import type { Node, Edge } from '@xyflow/react';
import type {
  AIModelEntity,
  DataProcessorEntity,
  AnnotationEntity,
  NodeEntity,
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
  businessEntityType: 'aiModel' | 'dataProcessor' | 'annotation';
  executable: boolean;
  // 执行状态 (仅适用于可执行节点)
  executionStatus?: 'pending' | 'running' | 'completed' | 'failed';
  executionProgress?: number;
  lastExecutionTime?: string;
  // 注释特定属性
  content?: string;
  annotationType?: 'note' | 'warning' | 'info' | 'title';
  customStyle?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    width?: number;
    height?: number;
  };
}

export interface RenderEdgeData extends Record<string, unknown> {
  label: string;
  color: string;
  animated: boolean;
  businessConnectionId: string;
  connectionType: 'execution' | 'reference';
}

// 严格类型的渲染节点和边
export type RenderNode = Node<RenderNodeData, 'aiModel' | 'dataProcessor' | 'annotation'>;
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
      executable: true,
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
      executable: true,
    },
  };
}

export function annotationToRenderNode(
  annotation: AnnotationEntity,
  step: WorkflowStepEntity
): RenderNode {
  return {
    id: step.id,
    type: 'annotation',
    position: step.position,
    data: {
      title: annotation.name,
      subtitle: annotation.annotationType,
      status: 'idle', // Annotations don't have execution status
      icon: getAnnotationIcon(annotation.annotationType),
      color: getAnnotationColor(annotation.annotationType),
      businessEntityId: annotation.id,
      businessEntityType: 'annotation',
      executable: false,
      content: annotation.content,
      annotationType: annotation.annotationType,
      customStyle: annotation.style,
    },
  };
}

// 通用节点转换器 - 根据实体类型调用具体转换器
export function nodeEntityToRenderNode(
  entity: NodeEntity,
  step: WorkflowStepEntity
): RenderNode {
  if (entity.executable) {
    // 可执行实体
    if ('provider' in entity) {
      return aiModelToRenderNode(entity as AIModelEntity, step);
    } else if ('type' in entity) {
      return dataProcessorToRenderNode(entity as DataProcessorEntity, step);
    }
  } else {
    // 不可执行实体
    if ('content' in entity) {
      return annotationToRenderNode(entity as AnnotationEntity, step);
    }
  }
  
  throw new Error(`Unsupported entity type for node conversion`);
}

export function connectionToRenderEdge(
  connection: WorkflowConnectionEntity,
  sourceStep: WorkflowStepEntity,
  targetStep: WorkflowStepEntity
): RenderEdge {
  const isExecutionConnection = sourceStep.executable && targetStep.executable;
  
  return {
    id: connection.id,
    source: sourceStep.id,
    target: targetStep.id,
    type: 'workflow',
    data: {
      label: isExecutionConnection ? 'Data Flow' : 'Reference',
      color: isExecutionConnection ? '#10b981' : '#6b7280',
      animated: isExecutionConnection,
      businessConnectionId: connection.id,
      connectionType: connection.connectionType,
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

function getAnnotationIcon(type: AnnotationEntity['annotationType']): string {
  switch (type) {
    case 'note': return 'note';
    case 'warning': return 'warning';
    case 'info': return 'info';
    case 'title': return 'title';
    default: return 'note';
  }
}

function getAnnotationColor(type: AnnotationEntity['annotationType']): string {
  switch (type) {
    case 'note': return '#f3f4f6';
    case 'warning': return '#fef3c7';
    case 'info': return '#dbeafe';
    case 'title': return '#f0f9ff';
    default: return '#f3f4f6';
  }
} 