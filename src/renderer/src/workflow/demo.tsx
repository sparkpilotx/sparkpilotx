// 架构演示组件 - 展示纯渲染器架构的实现

import { useEffect } from 'react';
import { WorkflowEditor, initializeWorkflowDemo } from './index';

export function WorkflowDemo() {
  // 初始化演示数据
  useEffect(() => {
    initializeWorkflowDemo();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Workflow Editor
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Pure Renderer Architecture Demo
            </p>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Pure Renderer
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <WorkflowEditor />
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Architecture: Business Layer → Adapter → Render Layer
          </div>
          <div>
            React Flow as Pure Renderer ✨
          </div>
        </div>
      </div>
    </div>
  );
} 