// 纯渲染器 - React Flow作为纯粹的渲染引擎

import '@xyflow/react/dist/style.css';
import '../styles/workflow-theme.css';

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type FitViewOptions,
  type DefaultEdgeOptions,
  type Node,
  type Connection,
} from '@xyflow/react';

import { useCallback, useMemo, useRef, useEffect } from 'react';
import { useRenderStore } from '../stores/render-store';
import { useWorkflowSync } from '../hooks/use-workflow-sync';
import { useExecutionStatus } from '../hooks/use-execution-status';
import { useBusinessStore } from '../stores/business-store';
import { renderNodeTypes, renderEdgeTypes } from '../constants/render-types';
import { WorkflowToolbar } from './workflow-toolbar';
import { ExecutionPanel } from './execution-panel';

// React Flow配置 - 纯视图配置
const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
  style: { strokeWidth: 2 },
};

export function WorkflowEditor() {
  // 同步业务数据到视图数据
  const { hasCurrentWorkflow } = useWorkflowSync();
  
  // 执行状态同步
  useExecutionStatus();
  
  // 获取纯视图数据和事件处理器
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
  } = useRenderStore();
  
  // 控制初始化时的 fitView
  const hasInitializedRef = useRef(false);
  
  // 当有节点时，标记为已初始化
  useEffect(() => {
    if (nodes.length > 0 && !hasInitializedRef.current) {
      // 延迟标记，确保首次 fitView 完成
      setTimeout(() => {
        hasInitializedRef.current = true;
      }, 100);
    } else if (nodes.length === 0) {
      // 重置初始化状态，允许下次重新 fitView
      hasInitializedRef.current = false;
    }
  }, [nodes.length]);
  
  // 获取业务操作方法
  const {
    updateWorkflowStep,
    addWorkflowConnection,
    currentWorkflowId,
  } = useBusinessStore();
  
  // Memoized event handlers to prevent unnecessary re-renders
  const handleNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    console.log('Edit node:', node.id);
    // 这里可以打开节点编辑对话框
  }, []);
  
  const handleConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target && currentWorkflowId) {
      // 在创建连接之前，确保所有节点的当前位置都同步到业务层
      nodes.forEach((node) => {
        updateWorkflowStep(node.id, {
          position: node.position,
        });
      });
      
      // 然后创建连接
      addWorkflowConnection({
        workflowId: currentWorkflowId,
        sourceStepId: connection.source,
        targetStepId: connection.target,
        connectionType: 'execution',
        dataMapping: {}, // Empty mapping for now
      });
    }
  }, [currentWorkflowId, addWorkflowConnection, nodes, updateWorkflowStep]);
  
  // Memoized React Flow props to prevent unnecessary re-renders
  const reactFlowProps = useMemo(() => ({
    nodeTypes: renderNodeTypes,
    edgeTypes: renderEdgeTypes,
    fitViewOptions,
    defaultEdgeOptions,
    className: "workflow-editor",
    colorMode: "light" as const,
    attributionPosition: "bottom-left" as const,
    deleteKeyCode: ['Backspace', 'Delete'],
  }), []);
  
  if (!hasCurrentWorkflow) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Workflow Selected
          </h3>
          <p className="text-gray-500">
            Please select or create a workflow to start editing.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full relative">
      <WorkflowToolbar />
      <ExecutionPanel />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeDoubleClick={handleNodeDoubleClick}
        fitView={!hasInitializedRef.current}
        {...reactFlowProps}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeStrokeColor={(n) => (n.data as any)?.color || '#1a192b'}
          nodeColor={(n) => (n.data as any)?.color || '#fff'}
          nodeBorderRadius={2}
        />
      </ReactFlow>
    </div>
  );
}