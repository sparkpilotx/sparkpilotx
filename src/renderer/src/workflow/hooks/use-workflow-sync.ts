// 同步Hook - 业务数据到视图数据的桥梁

import { useEffect, useMemo } from 'react';
import { useBusinessStore } from '../stores/business-store';
import { useRenderStore } from '../stores/render-store';
import {
  aiModelToRenderNode,
  dataProcessorToRenderNode,
  annotationToRenderNode,
  connectionToRenderEdge,
} from '../adapters/business-to-render';
import type { RenderNode, RenderEdge } from '../adapters/business-to-render';

export function useWorkflowSync() {
  const {
    aiModels,
    dataProcessors,
    annotations,
    workflowSteps,
    workflowConnections,
    currentWorkflowId,
  } = useBusinessStore();
  
  const { syncFromBusiness } = useRenderStore();
  
  // Memoize current workflow steps to avoid unnecessary recalculations
  const currentSteps = useMemo(() => {
    if (!currentWorkflowId) return [];
    return Array.from(workflowSteps.values()).filter(
      (step) => step.workflowId === currentWorkflowId
    );
  }, [workflowSteps, currentWorkflowId]);
  
  // Memoize current workflow connections
  const currentConnections = useMemo(() => {
    if (!currentWorkflowId) return [];
    return Array.from(workflowConnections.values()).filter(
      (connection) => connection.workflowId === currentWorkflowId
    );
  }, [workflowConnections, currentWorkflowId]);
  
  // Memoize render nodes conversion
  const renderNodes = useMemo((): RenderNode[] => {
    return currentSteps.map((step) => {
      if (step.entityType === 'aiModel') {
        const model = aiModels.get(step.entityId);
        if (!model) {
          throw new Error(`AI Model not found: ${step.entityId}`);
        }
        return aiModelToRenderNode(model, step);
      } else if (step.entityType === 'dataProcessor') {
        const processor = dataProcessors.get(step.entityId);
        if (!processor) {
          throw new Error(`Data Processor not found: ${step.entityId}`);
        }
        return dataProcessorToRenderNode(processor, step);
      } else if (step.entityType === 'annotation') {
        const annotation = annotations.get(step.entityId);
        if (!annotation) {
          throw new Error(`Annotation not found: ${step.entityId}`);
        }
        return annotationToRenderNode(annotation, step);
      }
      
      throw new Error(`Unknown entity type: ${step.entityType}`);
    });
  }, [currentSteps, aiModels, dataProcessors, annotations]);
  
  // Memoize render edges conversion
  const renderEdges = useMemo((): RenderEdge[] => {
    return currentConnections.map((connection) => {
      const sourceStep = workflowSteps.get(connection.sourceStepId);
      const targetStep = workflowSteps.get(connection.targetStepId);
      
      if (!sourceStep || !targetStep) {
        throw new Error('Invalid connection: step not found');
      }
      
      return connectionToRenderEdge(connection, sourceStep, targetStep);
    });
  }, [currentConnections, workflowSteps]);
  
  // 简单直接的同步：信任业务层数据的完整性
  useEffect(() => {
    syncFromBusiness(renderNodes, renderEdges);
  }, [renderNodes, renderEdges, syncFromBusiness]);
  
  // 返回当前工作流信息，供组件使用
  return {
    currentWorkflowId,
    hasCurrentWorkflow: !!currentWorkflowId,
  };
} 