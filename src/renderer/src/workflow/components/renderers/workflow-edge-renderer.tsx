// 工作流边渲染器 - 纯视图组件

import { memo } from 'react';
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
} from '@xyflow/react';
import type { RenderEdge } from '../../adapters/business-to-render';

export const WorkflowEdgeRenderer = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps<RenderEdge>) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Type guard to ensure data exists
  if (!data) {
    return (
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: '#10b981', strokeWidth: 2 }}
      />
    );
  }

  return (
    <>
      {/* Main Edge Path */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: data.color,
          strokeWidth: 2,
          strokeDasharray: data.animated ? '5,5' : 'none',
        }}
        className={data.animated ? 'animate-pulse' : ''}
      />

      {/* Edge Label */}
      {data.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-white px-2 py-1 rounded-md shadow-md border border-gray-200 text-gray-800 font-medium">
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}); 