// 工作流模块主入口 - 纯渲染器架构实现

// 业务实体
export type {
  AIModelEntity,
  DataProcessorEntity,
  WorkflowEntity,
  WorkflowStepEntity,
  WorkflowConnectionEntity,
} from './domain/entities';

// 业务Store
export { useBusinessStore } from './stores/business-store';

// 视图数据类型
export type {
  RenderNodeData,
  RenderEdgeData,
  RenderNode,
  RenderEdge,
} from './adapters/business-to-render';

// 渲染Store
export { useRenderStore } from './stores/render-store';

// 主要组件
export { WorkflowEditor } from './components/workflow-editor';

// 同步Hook
export { useWorkflowSync } from './hooks/use-workflow-sync';

// 示例数据
export {
  sampleAIModels,
  sampleDataProcessors,
  sampleWorkflow,
  sampleWorkflowSteps,
  sampleWorkflowConnections,
} from './data/sample-data';

import {
  sampleAIModels,
  sampleDataProcessors,
  sampleWorkflow,
  sampleWorkflowSteps,
  sampleWorkflowConnections,
} from './data/sample-data';
import { useBusinessStore } from './stores/business-store';

// 初始化业务数据的辅助函数
export function initializeWorkflowDemo() {
  const businessStore = useBusinessStore.getState();
  
  // 清除现有数据
  businessStore.aiModels.clear();
  businessStore.dataProcessors.clear();
  businessStore.workflows.clear();
  businessStore.workflowSteps.clear();
  businessStore.workflowConnections.clear();
  
  // 设置AI模型
  sampleAIModels.forEach((model) => {
    businessStore.aiModels.set(model.id, model);
  });
  
  // 设置数据处理器
  sampleDataProcessors.forEach((processor) => {
    businessStore.dataProcessors.set(processor.id, processor);
  });
  
  // 设置工作流
  businessStore.workflows.set(sampleWorkflow.id, sampleWorkflow);
  
  // 设置工作流步骤
  sampleWorkflowSteps.forEach((step) => {
    businessStore.workflowSteps.set(step.id, step);
  });
  
  // 设置工作流连接
  sampleWorkflowConnections.forEach((connection) => {
    businessStore.workflowConnections.set(connection.id, connection);
  });
  
  // 设置当前工作流
  businessStore.setCurrentWorkflow(sampleWorkflow.id);
  
  console.log('✅ Workflow demo data initialized');
  console.log('📊 Business entities loaded:', {
    aiModels: businessStore.aiModels.size,
    dataProcessors: businessStore.dataProcessors.size,
    workflows: businessStore.workflows.size,
    workflowSteps: businessStore.workflowSteps.size,
    workflowConnections: businessStore.workflowConnections.size,
  });
} 