// 架构演示组件 - 展示纯渲染器架构的实现

import { useEffect } from 'react';
import { WorkflowEditor, initializeWorkflowDemo } from './index';

export function WorkflowDemo() {
  // 初始化演示数据
  useEffect(() => {
    initializeWorkflowDemo();
  }, []);

  return (
    <div className="w-full h-full">
      <WorkflowEditor />
    </div>
  );
} 