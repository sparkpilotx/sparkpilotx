// 渲染Store - 管理纯视图数据，React Flow的数据源

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react';
import type { RenderNode, RenderEdge } from '../adapters/business-to-render';
import { useBusinessStore } from './business-store';

interface RenderState {
  // Pure Render Data - React Flow的数据源
  nodes: RenderNode[];
  edges: RenderEdge[];
  
  // React Flow Event Handlers
  onNodesChange: OnNodesChange<RenderNode>;
  onEdgesChange: OnEdgesChange;
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
  
  // Business Integration
  setBusinessStore: (businessStore: ReturnType<typeof useBusinessStore>) => void;
  businessStore?: ReturnType<typeof useBusinessStore>;
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
        const { businessStore } = get();
        
        // Apply visual changes first
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes),
        }));
        
        // Handle business logic for each change
        changes.forEach((change) => {
          switch (change.type) {
            case 'position':
              if (change.position && businessStore) {
                // Update business layer with new position
                businessStore.getState().updateWorkflowStep(change.id, {
                  position: change.position,
                });
              }
              break;
              
            case 'remove':
              if (businessStore) {
                // Remove from business layer
                businessStore.getState().deleteWorkflowStep(change.id);
              }
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
        const { businessStore } = get();
        
        // Apply visual changes
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges),
        }));
        
        // Handle business logic
        changes.forEach((change) => {
          switch (change.type) {
            case 'remove':
              if (businessStore) {
                businessStore.getState().deleteWorkflowConnection(change.id);
              }
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
        const { businessStore } = get();
        
        if (businessStore && connection.source && connection.target) {
          // Add to business layer first
          const connectionId = businessStore.getState().addWorkflowConnection({
            workflowId: businessStore.getState().currentWorkflowId || '',
            sourceStepId: connection.source,
            targetStepId: connection.target,
            sourceHandle: connection.sourceHandle || 'default',
            targetHandle: connection.targetHandle || 'default',
          });
          
          // Visual update will happen through sync
        } else {
          // Fallback: add to render layer only - but we should avoid this
          console.warn('No business store available for connection');
        }
      },
      
      onNodeDoubleClick: (event, node) => {
        // Trigger node editing
        console.log('Edit node:', node.id);
        // This will be handled by individual node renderers
      },
      
      onPaneClick: (event) => {
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
      
      // Sync from Business Layer - Simple and reliable sync
      syncFromBusiness: (nodes, edges) => {
        set({ nodes, edges });
      },
      
      // Business Integration
      setBusinessStore: (businessStore) => {
        set({ businessStore });
      },
    }),
    { name: 'render-store' }
  )
); 