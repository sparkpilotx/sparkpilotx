// 渲染器类型注册 - React Flow的纯视图组件

import { AIModelRenderer } from '../components/renderers/ai-model-renderer';
import { DataProcessorRenderer } from '../components/renderers/data-processor-renderer';
import AnnotationRenderer from '../components/renderers/annotation-renderer';
import { WorkflowEdgeRenderer } from '../components/renderers/workflow-edge-renderer';

// 注册自定义节点渲染器
export const renderNodeTypes = {
  aiModel: AIModelRenderer,
  dataProcessor: DataProcessorRenderer,
  annotation: AnnotationRenderer,
};

// 注册自定义边渲染器
export const renderEdgeTypes = {
  workflow: WorkflowEdgeRenderer,
}; 