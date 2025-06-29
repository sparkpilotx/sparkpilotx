// 工作流工具栏 - 添加节点和操作

import { useState } from 'react';
import { useBusinessStore } from '../stores/business-store';
import { useExecutionStore } from '../execution/execution-store';
import { workflowExecutor } from '../execution/workflow-executor';

export function WorkflowToolbar() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionInput, setExecutionInput] = useState('{"message": "Hello World"}');
  const [showExecutionDialog, setShowExecutionDialog] = useState(false);
  
  const { 
    createAIModel,
    createDataProcessor,
    createAnnotation,
    addWorkflowStep, 
    currentWorkflowId,
    createWorkflow,
    setCurrentWorkflow,
    clearCurrentWorkflow,
    workflows,
    workflowSteps,
  } = useBusinessStore();
  
  const { 
    executions,
    setCurrentExecution,
    currentExecutionId,
    updateStepStatus,
    clearStepStatuses,
  } = useExecutionStore();
  
  const handleAddAIModel = () => {
    if (!currentWorkflowId) {
      // Create a new workflow if none exists
      const workflowId = createWorkflow({
        name: 'New Workflow',
        status: 'draft',
        steps: [],
        connections: [],
      });
      setCurrentWorkflow(workflowId);
    }
    
    // Create AI model entity
    const modelId = createAIModel({
      name: 'New AI Model',
      provider: 'openai',
      modelId: 'gpt-3.5-turbo',
      configuration: {
        temperature: 0.7,
        maxTokens: 1000,
      },
      status: 'active',
    });
    
    // Add as workflow step
    addWorkflowStep({
      workflowId: currentWorkflowId!,
      entityType: 'aiModel',
      entityId: modelId,
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      configuration: {},
    });
  };
  
  const handleAddDataProcessor = () => {
    if (!currentWorkflowId) {
      const workflowId = createWorkflow({
        name: 'New Workflow',
        status: 'draft',
        steps: [],
        connections: [],
      });
      setCurrentWorkflow(workflowId);
    }
    
    // Create data processor entity
    const processorId = createDataProcessor({
      name: 'New Data Processor',
      type: 'transform',
      inputSchema: '{}',
      outputSchema: '{}',
      configuration: {
        operation: 'transform',
        rules: [],
      },
      status: 'active',
    });
    
    // Add as workflow step
    addWorkflowStep({
      workflowId: currentWorkflowId!,
      entityType: 'dataProcessor',
      entityId: processorId,
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      configuration: {},
    });
  };

  const handleAddAnnotation = (type: 'note' | 'warning' | 'info' | 'title') => {
    if (!currentWorkflowId) {
      const workflowId = createWorkflow({
        name: 'New Workflow',
        status: 'draft',
        steps: [],
        connections: [],
      });
      setCurrentWorkflow(workflowId);
    }
    
    // Create annotation entity with defaults based on type
    const annotationDefaults = {
      note: {
        name: 'Note',
        content: 'Add your note here...',
        style: { backgroundColor: '#f3f4f6', textColor: '#374151', fontSize: 'medium' as const, width: 200, height: 80 }
      },
      warning: {
        name: 'Warning',
        content: 'Important warning message...',
        style: { backgroundColor: '#fef3c7', textColor: '#92400e', fontSize: 'medium' as const, width: 220, height: 80 }
      },
      info: {
        name: 'Information',
        content: 'Helpful information...',
        style: { backgroundColor: '#dbeafe', textColor: '#1e40af', fontSize: 'medium' as const, width: 200, height: 80 }
      },
      title: {
        name: 'Title',
        content: 'Section Title\n\nDescription of this workflow section...',
        style: { backgroundColor: '#f0f9ff', textColor: '#0c4a6e', fontSize: 'large' as const, width: 280, height: 100 }
      }
    };
    
    const defaults = annotationDefaults[type];
    
    const annotationId = createAnnotation({
      name: defaults.name,
      content: defaults.content,
      annotationType: type,
      style: defaults.style,
    });
    
    // Add as workflow step
    addWorkflowStep({
      workflowId: currentWorkflowId!,
      entityType: 'annotation',
      entityId: annotationId,
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      configuration: {},
    });
  };
  
  const handleClearWorkflow = () => {
    if (currentWorkflowId) {
      // Confirm before clearing
      if (window.confirm('Are you sure you want to clear all nodes and connections in this workflow?')) {
        clearCurrentWorkflow();
      }
    }
  };
  
  const handleExecuteWorkflow = () => {
    if (!currentWorkflowId) {
      alert('No workflow selected');
      return;
    }
    
    const workflow = workflows.get(currentWorkflowId);
    if (!workflow) {
      alert('Workflow not found');
      return;
    }
    
    const steps = Array.from(workflowSteps.values()).filter(step => step.workflowId === currentWorkflowId);
    if (steps.length === 0) {
      alert('Workflow has no steps to execute');
      return;
    }
    
    setShowExecutionDialog(true);
  };
  
  const executeWorkflow = async () => {
    if (!currentWorkflowId) return;
    
    setIsExecuting(true);
    setShowExecutionDialog(false);
    
    try {
      // Parse input JSON
      let input: Record<string, unknown>;
      try {
        input = JSON.parse(executionInput);
      } catch (error) {
        alert('Invalid JSON input');
        setIsExecuting(false);
        return;
      }
      
      // 清除之前的执行状态
      clearStepStatuses();
      
      // 执行工作流
      console.log('Executing workflow with input:', input);
      
      const executionResult = await workflowExecutor.executeCurrentWorkflow(
        input,
        // 实时状态更新回调
        (stepId, status) => {
          console.log(`Step ${stepId} status:`, status);
          updateStepStatus(stepId, { stepId, ...status });
        }
      );
      
      setCurrentExecution(executionResult.id);
      
      console.log('Workflow execution completed:', executionResult);
      alert('Workflow execution completed!');
      setIsExecuting(false);
      
    } catch (error) {
      console.error('Execution failed:', error);
      alert(`Execution failed: ${error instanceof Error ? error.message : String(error)}`);
      setIsExecuting(false);
    }
  };
  
  return (
    <>
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg border p-2 flex gap-2">
        <button
          onClick={handleAddAIModel}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
          title="Add AI Model"
        >
          + AI Model
        </button>
        <button
          onClick={handleAddDataProcessor}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
          title="Add Data Processor"
        >
          + Processor
        </button>
        <div className="border-l mx-1"></div>
        <button
          onClick={() => handleAddAnnotation('title')}
          className="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-sm font-medium"
          title="Add Title Annotation"
        >
          📋 Title
        </button>
        <button
          onClick={() => handleAddAnnotation('note')}
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm font-medium"
          title="Add Note Annotation"
        >
          📝 Note
        </button>
        <button
          onClick={() => handleAddAnnotation('warning')}
          className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm font-medium"
          title="Add Warning Annotation"
        >
          ⚠️ Warning
        </button>
        <button
          onClick={() => handleAddAnnotation('info')}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
          title="Add Info Annotation"
        >
          ℹ️ Info
        </button>
        <div className="border-l mx-1"></div>
        <button
          onClick={handleExecuteWorkflow}
          disabled={!currentWorkflowId || isExecuting}
          className={`px-3 py-2 text-white rounded transition-colors text-sm font-medium ${
            currentWorkflowId && !isExecuting
              ? 'bg-purple-500 hover:bg-purple-600' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          title={
            !currentWorkflowId 
              ? "No workflow to execute" 
              : isExecuting 
                ? "Executing..." 
                : "Execute workflow"
          }
        >
          {isExecuting ? '⏳ Running...' : '▶️ Execute'}
        </button>
        <button
          onClick={handleClearWorkflow}
          disabled={!currentWorkflowId}
          className={`px-3 py-2 text-white rounded transition-colors text-sm font-medium ${
            currentWorkflowId 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          title={currentWorkflowId ? "Clear all nodes and connections" : "No workflow to clear"}
        >
          Clear All
        </button>
      </div>
      
      {/* 执行输入对话框 */}
      {showExecutionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Execute Workflow</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Data (JSON):
              </label>
              <textarea
                value={executionInput}
                onChange={(e) => setExecutionInput(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none font-mono text-sm"
                placeholder='{"message": "Hello World"}'
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowExecutionDialog(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeWorkflow}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 