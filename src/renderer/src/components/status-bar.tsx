import React from 'react'
import { useNodes, useEdges, useViewport } from '@xyflow/react'

export function StatusBar(): React.JSX.Element {
  // Access React Flow state and instance from StatusBar
  const nodes = useNodes()
  const edges = useEdges()
  const { x, y, zoom } = useViewport()

  // Calculate flow statistics
  const selectedNodes = nodes.filter(node => node.selected)
  const selectedEdges = edges.filter(edge => edge.selected)

  // Helper function to format numbers
  const formatNumber = (num: number) => num.toFixed(1)

  return (
    <footer className="h-6 px-4 bg-muted/40 text-muted-foreground flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        <span className="text-green-600 dark:text-green-400">Ready</span>
        <span>Nodes: {nodes.length}</span>
        <span>Edges: {edges.length}</span>
        {selectedNodes.length > 0 && (
          <span className="text-blue-600 dark:text-blue-400">
            Selected: {selectedNodes.length} node{selectedNodes.length !== 1 ? 's' : ''}
            {selectedEdges.length > 0 && `, ${selectedEdges.length} edge${selectedEdges.length !== 1 ? 's' : ''}`}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span>Zoom: {formatNumber(zoom * 100)}%</span>
        <span>Position: ({formatNumber(x)}, {formatNumber(y)})</span>
        <span>v{import.meta.env.VITE_APP_VERSION}</span>
        <span>TypeScript</span>
      </div>
    </footer>
  )
} 