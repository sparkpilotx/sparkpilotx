// 数据处理器节点渲染器 - 纯视图组件

import { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { RenderNode } from '../../adapters/business-to-render';
import { useBusinessStore } from '../../stores/business-store';

export const DataProcessorRenderer = memo(({ data, id }: NodeProps<RenderNode>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    type: 'transform' as const,
    inputSchema: '{}',
  });
  
  const { updateDataProcessor, dataProcessors } = useBusinessStore();
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  
  const handleSave = () => {
    // Find the data processor entity for this node  
    const processor = Array.from(dataProcessors.values()).find(proc => 
      proc.id === data.businessEntityId
    );
    
    if (processor) {
      updateDataProcessor(processor.id, {
        type: editValues.type,
        inputSchema: editValues.inputSchema,
        configuration: {
          ...processor.configuration,
          operation: editValues.type,
        }
      });
    }
    
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  // 获取执行状态样式
  const getExecutionStatusStyle = () => {
    switch (data.executionStatus) {
      case 'pending':
        return 'border-yellow-400 shadow-yellow-200';
      case 'running':
        return 'border-blue-400 shadow-blue-200 animate-pulse';
      case 'completed':
        return 'border-green-400 shadow-green-200';
      case 'failed':
        return 'border-red-400 shadow-red-200';
      default:
        return 'border-gray-200';
    }
  };
  
  // 获取执行状态图标和文本
  const getExecutionStatusDisplay = () => {
    switch (data.executionStatus) {
      case 'pending':
        return { icon: '⏳', text: 'Pending', color: 'text-yellow-600' };
      case 'running':
        return { icon: '🔄', text: 'Running', color: 'text-blue-600' };
      case 'completed':
        return { icon: '✅', text: 'Completed', color: 'text-green-600' };
      case 'failed':
        return { icon: '❌', text: 'Failed', color: 'text-red-600' };
      default:
        return null;
    }
  };
  const executionDisplay = getExecutionStatusDisplay();

  // 调试日志
  if (data.executionStatus) {
    console.log(`🎨 Data Processor ${id} rendering with execution status:`, data.executionStatus, data.executionProgress);
  }

  return (
    <div 
      className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[220px] hover:shadow-xl transition-all duration-300 ${getExecutionStatusStyle()}`}
      onDoubleClick={handleDoubleClick}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: data.color }}
        isConnectable={true}
      />
      
      {/* Node Content */}
      <div className="flex flex-col gap-2">
        {/* Status Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <div className="font-bold text-sm text-gray-800">Data Processor</div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                data.status === 'idle'
                  ? 'bg-gray-100 text-gray-600'
                  : data.status === 'running'
                  ? 'bg-blue-100 text-blue-600'
                  : data.status === 'success'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {data.status}
            </div>
          </div>
          
          {/* 执行状态指示器 */}
          {executionDisplay && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${executionDisplay.color} bg-opacity-10`}>
              <span>{executionDisplay.icon}</span>
              <span>{executionDisplay.text}</span>
            </div>
          )}
        </div>
        
        {/* Title */}
        <div className="text-lg font-semibold text-gray-900">
          {data.title}
        </div>
        
        {/* Subtitle */}
        <div className="text-sm text-gray-600 capitalize">
          {data.subtitle}
        </div>
        
        {/* 执行进度和时间 */}
        {data.executionStatus && (
          <div className="text-xs text-gray-500 space-y-1">
            {data.executionProgress !== undefined && (
              <div className="flex items-center gap-2">
                <span>Progress:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${data.executionProgress}%` }}
                  />
                </div>
                <span>{data.executionProgress}%</span>
              </div>
            )}
            {data.lastExecutionTime && (
              <div>Last run: {data.lastExecutionTime}</div>
            )}
          </div>
        )}
        
        {/* Edit Mode */}
        {isEditing && (
          <div className="mt-2 p-3 bg-gray-50 rounded border">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Processor Type
                </label>
                <select
                  value={editValues.type}
                  onChange={(e) => setEditValues(prev => ({ 
                    ...prev, 
                    type: e.target.value as typeof editValues.type
                  }))}
                  className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="filter">Filter</option>
                  <option value="transform">Transform</option>
                  <option value="validate">Validate</option>
                  <option value="aggregate">Aggregate</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Input Schema
                </label>
                <textarea
                  value={editValues.inputSchema}
                  onChange={(e) => setEditValues(prev => ({ 
                    ...prev, 
                    inputSchema: e.target.value 
                  }))}
                  className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  placeholder="JSON Schema"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Interaction Hint */}
        {!isEditing && (
          <div className="text-xs text-gray-400 mt-1">
            Double-click to edit configuration
          </div>
        )}
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: data.color }}
        isConnectable={true}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.data.businessEntityId === nextProps.data.businessEntityId &&
    prevProps.data.title === nextProps.data.title &&
    prevProps.data.subtitle === nextProps.data.subtitle &&
    prevProps.data.status === nextProps.data.status &&
    prevProps.data.color === nextProps.data.color &&
    prevProps.data.executionStatus === nextProps.data.executionStatus &&
    prevProps.data.executionProgress === nextProps.data.executionProgress &&
    prevProps.data.lastExecutionTime === nextProps.data.lastExecutionTime &&
    prevProps.id === nextProps.id &&
    prevProps.selected === nextProps.selected &&
    prevProps.dragging === nextProps.dragging
  );
}); 