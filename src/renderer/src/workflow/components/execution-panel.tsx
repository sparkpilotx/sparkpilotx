// 工作流执行面板 - 显示执行历史和状态

import { useState, useEffect } from 'react';
import { useExecutionStore } from '../execution/execution-store';
import { useBusinessStore } from '../stores/business-store';
import type { WorkflowExecutionEntity } from '../domain/entities';

export function ExecutionPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    executions, 
    currentExecutionId,
    setCurrentExecution,
    getExecutionLogs,
  } = useExecutionStore();
  
  const { currentWorkflowId } = useBusinessStore();
  
  // 获取当前工作流的执行记录
  const workflowExecutions = Array.from(executions.values())
    .filter(exec => exec.workflowId === currentWorkflowId)
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  
  const currentExecution = currentExecutionId ? executions.get(currentExecutionId) : null;
  
  // 格式化执行时间
  const formatDuration = (execution: WorkflowExecutionEntity): string => {
    if (!execution.endTime) {
      const duration = Date.now() - execution.startTime.getTime();
      return `${Math.floor(duration / 1000)}s (running)`;
    }
    
    const duration = execution.endTime.getTime() - execution.startTime.getTime();
    return `${Math.floor(duration / 1000)}s`;
  };
  
  // 获取状态颜色
  const getStatusColor = (status: WorkflowExecutionEntity['status']): string => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <>
      {/* 执行面板切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-20 bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
        title="Toggle Execution Panel"
      >
        📊
      </button>
      
      {/* 执行面板 */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-20 w-80 h-96 bg-white rounded-lg shadow-xl border overflow-hidden">
          <div className="bg-purple-500 text-white p-3 flex justify-between items-center">
            <h3 className="font-medium">Execution History</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          <div className="h-full overflow-y-auto pb-16">
            {workflowExecutions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No executions yet
              </div>
            ) : (
              <div className="p-2">
                {workflowExecutions.map((execution) => (
                  <div
                    key={execution.id}
                    className={`p-3 mb-2 rounded border cursor-pointer transition-colors ${
                      execution.id === currentExecutionId
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentExecution(execution.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">
                        {execution.startTime.toLocaleTimeString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(execution.status)}`}>
                        {execution.status}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-1">
                      Duration: {formatDuration(execution)}
                    </div>
                    
                    {execution.error && (
                      <div className="text-xs text-red-600 truncate" title={execution.error}>
                        Error: {execution.error}
                      </div>
                    )}
                    
                    {execution.output && (
                      <div className="text-xs text-green-600">
                        ✓ Completed successfully
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 当前执行详情 */}
          {currentExecution && (
            <div className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t p-3 max-h-32 overflow-y-auto">
              <div className="text-sm font-medium mb-1">Current Execution</div>
              <div className="text-xs text-gray-600">
                <div>Status: {currentExecution.status}</div>
                <div>Started: {currentExecution.startTime.toLocaleString()}</div>
                {currentExecution.endTime && (
                  <div>Ended: {currentExecution.endTime.toLocaleString()}</div>
                )}
              </div>
              
              {/* 输入数据 */}
              {currentExecution.input && (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer text-blue-600">Input Data</summary>
                  <pre className="text-xs bg-white p-2 mt-1 rounded border overflow-x-auto">
                    {JSON.stringify(currentExecution.input, null, 2)}
                  </pre>
                </details>
              )}
              
              {/* 输出数据 */}
              {currentExecution.output && (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer text-green-600">Output Data</summary>
                  <pre className="text-xs bg-white p-2 mt-1 rounded border overflow-x-auto">
                    {JSON.stringify(currentExecution.output, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
} 