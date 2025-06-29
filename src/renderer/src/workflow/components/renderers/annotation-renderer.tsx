// Annotation节点渲染器 - 纯视图组件

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { RenderNode } from '../../adapters/business-to-render';

function AnnotationRenderer({ data }: NodeProps<RenderNode>) {
  const {
    title,
    content,
    annotationType = 'note',
    customStyle = {},
    color,
  } = data;

  // Apply custom styling with defaults
  const nodeStyle = {
    backgroundColor: customStyle.backgroundColor || color,
    color: customStyle.textColor || '#374151',
    fontSize: getFontSize(customStyle.fontSize || 'medium'),
    width: customStyle.width || 200,
    minHeight: customStyle.height || 80,
  };

  const iconStyle = getAnnotationIconStyle(annotationType);

  return (
    <div
      className="annotation-node border-2 border-gray-200 rounded-lg shadow-sm p-3"
      style={nodeStyle}
    >
      {/* Header with icon and title */}
      <div className="flex items-center gap-2 mb-2">
        <div 
          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${iconStyle.className}`}
          style={{ backgroundColor: iconStyle.backgroundColor, color: iconStyle.textColor }}
        >
          {iconStyle.icon}
        </div>
        <div className="font-medium text-sm truncate flex-1">{title}</div>
      </div>

      {/* Content */}
      {content && (
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </div>
      )}

      {/* No handles for annotations - they cannot be connected to execution flow */}
      {/* But we can add reference handles if needed for visual connections */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-gray-300 border border-gray-400"
        style={{ 
          opacity: 0.3,
          cursor: 'not-allowed'
        }}
        isConnectable={false}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-gray-300 border border-gray-400"
        style={{ 
          opacity: 0.3,
          cursor: 'not-allowed'
        }}
        isConnectable={false}
      />
    </div>
  );
}

// Helper functions
function getFontSize(size: 'small' | 'medium' | 'large'): string {
  switch (size) {
    case 'small': return '12px';
    case 'medium': return '14px';
    case 'large': return '16px';
    default: return '14px';
  }
}

function getAnnotationIconStyle(type: 'note' | 'warning' | 'info' | 'title') {
  switch (type) {
    case 'note':
      return {
        icon: '📝',
        className: 'text-gray-600',
        backgroundColor: '#f3f4f6',
        textColor: '#374151',
      };
    case 'warning':
      return {
        icon: '⚠️',
        className: 'text-yellow-600',
        backgroundColor: '#fef3c7',
        textColor: '#d97706',
      };
    case 'info':
      return {
        icon: 'ℹ️',
        className: 'text-blue-600',
        backgroundColor: '#dbeafe',
        textColor: '#2563eb',
      };
    case 'title':
      return {
        icon: '📋',
        className: 'text-blue-500',
        backgroundColor: '#f0f9ff',
        textColor: '#0ea5e9',
      };
    default:
      return {
        icon: '📝',
        className: 'text-gray-600',
        backgroundColor: '#f3f4f6',
        textColor: '#374151',
      };
  }
}

export default memo(AnnotationRenderer); 