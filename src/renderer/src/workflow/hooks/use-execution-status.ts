// 实时执行状态同步Hook

import { useEffect, useRef } from 'react';
import { useExecutionStore } from '../execution/execution-store';
import { useRenderStore } from '../stores/render-store';

export function useExecutionStatus() {
  const { currentStepStatuses, currentExecutionId } = useExecutionStore();
  const setNodes = useRenderStore(state => state.setNodes);
  
  // 使用 ref 来存储 setNodes 引用，确保稳定性
  const setNodesRef = useRef(setNodes);
  setNodesRef.current = setNodes;
  
  // 使用 ref 来存储上一次的状态，避免不必要的更新
  const previousStatusesRef = useRef<Map<string, any>>(new Map());
  
  // 同步执行状态到渲染节点
  useEffect(() => {
    // 检查状态是否真的发生了变化
    const previousStatuses = previousStatusesRef.current;
    let hasChanges = false;
    
    // 检查大小是否变化
    if (currentStepStatuses.size !== previousStatuses.size) {
      hasChanges = true;
    } else {
      // 检查内容是否变化
      for (const [stepId, status] of currentStepStatuses) {
        const prevStatus = previousStatuses.get(stepId);
        if (!prevStatus || 
            prevStatus.status !== status.status ||
            prevStatus.progress !== status.progress ||
            prevStatus.startTime?.getTime() !== status.startTime?.getTime()) {
          hasChanges = true;
          break;
        }
      }
      
      // 检查是否有步骤被移除
      if (!hasChanges) {
        for (const stepId of previousStatuses.keys()) {
          if (!currentStepStatuses.has(stepId)) {
            hasChanges = true;
            break;
          }
        }
      }
    }
    
    // 只有在真正有变化时才更新
    if (!hasChanges) {
      return;
    }
    
    console.log('🔄 Execution status changed:', Array.from(currentStepStatuses.entries()));
    
    // 更新 ref
    previousStatusesRef.current = new Map(currentStepStatuses);
    
    // 获取当前节点状态并更新
    const { nodes } = useRenderStore.getState();
    
    if (currentStepStatuses.size === 0) {
      // 清除所有执行状态
      const hasExecutionStatus = nodes.some(node => 
        node.data.executionStatus !== undefined
      );
      
      if (hasExecutionStatus) {
        const updatedNodes = nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            executionStatus: undefined,
            executionProgress: undefined,
            lastExecutionTime: undefined,
          },
        }));
        setNodesRef.current(updatedNodes);
      }
      return;
    }
    
    // 更新节点的执行状态
    let needsUpdate = false;
    const updatedNodes = nodes.map(node => {
      const stepStatus = currentStepStatuses.get(node.id);
      
      if (stepStatus) {
        const newExecutionStatus = stepStatus.status;
        const newExecutionProgress = stepStatus.progress;
        const newLastExecutionTime = stepStatus.startTime?.toLocaleTimeString();
        
        // 只有当状态真正改变时才更新
        if (
          node.data.executionStatus !== newExecutionStatus ||
          node.data.executionProgress !== newExecutionProgress ||
          node.data.lastExecutionTime !== newLastExecutionTime
        ) {
          needsUpdate = true;
          return {
            ...node,
            data: {
              ...node.data,
              executionStatus: newExecutionStatus,
              executionProgress: newExecutionProgress,
              lastExecutionTime: newLastExecutionTime,
            },
          };
        }
      } else if (node.data.executionStatus !== undefined) {
        // 清除不再有状态的节点
        needsUpdate = true;
        return {
          ...node,
          data: {
            ...node.data,
            executionStatus: undefined,
            executionProgress: undefined,
            lastExecutionTime: undefined,
          },
        };
      }
      
      return node;
    });
    
    if (needsUpdate) {
      console.log('📊 Updating nodes with execution status:', updatedNodes.filter(n => n.data.executionStatus).map(n => ({ id: n.id, status: n.data.executionStatus })));
      setNodesRef.current(updatedNodes);
    }
  }, [currentStepStatuses]); // 移除 setNodes 依赖
  
  // 返回执行状态控制方法
  return {
    updateStepStatus: useExecutionStore.getState().updateStepStatus,
    clearStepStatuses: useExecutionStore.getState().clearStepStatuses,
    currentExecutionId,
  };
} 