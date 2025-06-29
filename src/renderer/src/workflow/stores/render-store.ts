// 渲染Store - 管理纯视图数据，React Flow的数据源

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import type { RenderNode, RenderEdge } from '../adapters/business-to-render';

interface RenderState {
  // Pure Render Data - React Flow的数据源
  nodes: RenderNode[];
  edges: RenderEdge[];
  
  // React Flow Event Handlers
  onNodesChange: OnNodesChange<RenderNode>;
  onEdgesChange: OnEdgesChange<RenderEdge>;
  onConnect: OnConnect;
  onNodeDoubleClick: (event: React.MouseEvent, node: RenderNode) => void;
  onPaneClick: (event: React.MouseEvent) => void;
  
  // Selection State
  selectedNodes: string[];
  selectedEdges: string[];
  
  // Render Actions - 只处理视图层操作
  setNodes: (nodes: RenderNode[]) => void;
  setEdges: (edges: RenderEdge[]) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  setSelectedNodes: (nodeIds: string[]) => void;
  setSelectedEdges: (edgeIds: string[]) => void;
  
  // Sync from Business Layer
  syncFromBusiness: (nodes: RenderNode[], edges: RenderEdge[]) => void;
}

export const useRenderStore = create<RenderState>()(
  devtools(
    (set, get) => ({
      // Initial State
      nodes: [],
      edges: [],
      selectedNodes: [],
      selectedEdges: [],
      
      // React Flow Event Handlers
      onNodesChange: (changes) => {
        // Apply visual changes first
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes),
        }));
        
        // Handle business logic for each change
        changes.forEach((change) => {
          switch (change.type) {
            case 'position':
              // Position updates are handled by the business layer through sync
              break;
              
            case 'remove':
              // Remove operations are handled by the business layer through sync
              break;
              
            case 'select':
              // Handle selection state
              const { selectedNodes } = get();
              const newSelection = change.selected
                ? [...selectedNodes, change.id]
                : selectedNodes.filter(id => id !== change.id);
              set({ selectedNodes: newSelection });
              break;
          }
        });
      },
      
      onEdgesChange: (changes) => {
        // Apply visual changes
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges),
        }));
        
        // Handle business logic
        changes.forEach((change) => {
          switch (change.type) {
            case 'remove':
              // Remove operations are handled by the business layer through sync
              break;
              
            case 'select':
              const { selectedEdges } = get();
              const newSelection = change.selected
                ? [...selectedEdges, change.id]
                : selectedEdges.filter(id => id !== change.id);
              set({ selectedEdges: newSelection });
              break;
          }
        });
      },
      
      onConnect: (connection) => {
        if (connection.source && connection.target) {
          // Connection logic is handled by the workflow editor component
          console.log('Connection attempt:', connection);
        }
      },
      
      onNodeDoubleClick: (_event, node) => {
        // Trigger node editing
        console.log('Edit node:', node.id);
        // This will be handled by individual node renderers
      },
      
      onPaneClick: (_event) => {
        // Clear selection
        set({ selectedNodes: [], selectedEdges: [] });
      },
      
      // Render Actions
      setNodes: (nodes) => {
        set({ nodes });
      },
      
      setEdges: (edges) => {
        set({ edges });
      },
      
      updateNodePosition: (nodeId, position) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId ? { ...node, position } : node
          ),
        }));
      },
      
      setSelectedNodes: (nodeIds) => {
        set({ selectedNodes: nodeIds });
      },
      
      setSelectedEdges: (edgeIds) => {
        set({ selectedEdges: edgeIds });
      },
      
      // Sync from Business Layer
      syncFromBusiness: (nodes, edges) => {
        set({ nodes, edges });
      },
    }),
    { name: 'render-store' }
  )
); 