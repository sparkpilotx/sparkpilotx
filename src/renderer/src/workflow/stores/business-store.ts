// 业务数据Store - 管理纯业务数据，不关心UI

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AIModelEntity,
  DataProcessorEntity,
  WorkflowEntity,
  WorkflowStepEntity,
  WorkflowConnectionEntity,
} from '../domain/entities';

interface BusinessState {
  // Business Data Collections
  aiModels: Map<string, AIModelEntity>;
  dataProcessors: Map<string, DataProcessorEntity>;
  workflows: Map<string, WorkflowEntity>;
  workflowSteps: Map<string, WorkflowStepEntity>;
  workflowConnections: Map<string, WorkflowConnectionEntity>;
  
  // Current Context
  currentWorkflowId: string | null;
  
  // Business Actions
  createAIModel: (model: Omit<AIModelEntity, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateAIModel: (id: string, updates: Partial<AIModelEntity>) => void;
  deleteAIModel: (id: string) => void;
  
  createDataProcessor: (processor: Omit<DataProcessorEntity, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateDataProcessor: (id: string, updates: Partial<DataProcessorEntity>) => void;
  deleteDataProcessor: (id: string) => void;
  
  createWorkflow: (workflow: Omit<WorkflowEntity, 'id' | 'createdAt' | 'updatedAt'>) => string;
  setCurrentWorkflow: (workflowId: string | null) => void;
  clearCurrentWorkflow: () => void;
  
  addWorkflowStep: (step: Omit<WorkflowStepEntity, 'id' | 'createdAt'>) => string;
  updateWorkflowStep: (stepId: string, updates: Partial<WorkflowStepEntity>) => void;
  deleteWorkflowStep: (stepId: string) => void;
  
  addWorkflowConnection: (connection: Omit<WorkflowConnectionEntity, 'id' | 'createdAt'>) => string;
  deleteWorkflowConnection: (connectionId: string) => void;
}

export const useBusinessStore = create<BusinessState>()(
  devtools(
    (set, get) => ({
      // Initial State
      aiModels: new Map(),
      dataProcessors: new Map(),
      workflows: new Map(),
      workflowSteps: new Map(),
      workflowConnections: new Map(),
      currentWorkflowId: null,
      
      // AI Model Actions
      createAIModel: (modelData) => {
        const id = `aimodel_${Date.now()}`;
        const model: AIModelEntity = {
          ...modelData,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          aiModels: new Map(state.aiModels).set(id, model),
        }));
        
        return id;
      },
      
      updateAIModel: (id, updates) => {
        const { aiModels } = get();
        const model = aiModels.get(id);
        if (!model) return;
        
        const updatedModel = {
          ...model,
          ...updates,
          updatedAt: new Date(),
        };
        
        set((state) => ({
          aiModels: new Map(state.aiModels).set(id, updatedModel),
        }));
      },
      
      deleteAIModel: (id) => {
        set((state) => {
          const newModels = new Map(state.aiModels);
          newModels.delete(id);
          return { aiModels: newModels };
        });
      },
      
      // Data Processor Actions
      createDataProcessor: (processorData) => {
        const id = `dataprocessor_${Date.now()}`;
        const processor: DataProcessorEntity = {
          ...processorData,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          dataProcessors: new Map(state.dataProcessors).set(id, processor),
        }));
        
        return id;
      },
      
      updateDataProcessor: (id, updates) => {
        const { dataProcessors } = get();
        const processor = dataProcessors.get(id);
        if (!processor) return;
        
        const updatedProcessor = {
          ...processor,
          ...updates,
          updatedAt: new Date(),
        };
        
        set((state) => ({
          dataProcessors: new Map(state.dataProcessors).set(id, updatedProcessor),
        }));
      },
      
      deleteDataProcessor: (id) => {
        set((state) => {
          const newProcessors = new Map(state.dataProcessors);
          newProcessors.delete(id);
          return { dataProcessors: newProcessors };
        });
      },
      
      // Workflow Actions
      createWorkflow: (workflowData) => {
        const id = `workflow_${Date.now()}`;
        const workflow: WorkflowEntity = {
          ...workflowData,
          id,
          steps: [],
          connections: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          workflows: new Map(state.workflows).set(id, workflow),
        }));
        
        return id;
      },
      
      setCurrentWorkflow: (workflowId) => {
        set({ currentWorkflowId: workflowId });
      },
      
      clearCurrentWorkflow: () => {
        const { currentWorkflowId } = get();
        if (!currentWorkflowId) return;
        
        // Remove all steps for current workflow
        set((state) => {
          const newSteps = new Map(state.workflowSteps);
          const newConnections = new Map(state.workflowConnections);
          
          // Delete all steps belonging to current workflow
          for (const [stepId, step] of state.workflowSteps) {
            if (step.workflowId === currentWorkflowId) {
              newSteps.delete(stepId);
            }
          }
          
          // Delete all connections belonging to current workflow
          for (const [connectionId, connection] of state.workflowConnections) {
            if (connection.workflowId === currentWorkflowId) {
              newConnections.delete(connectionId);
            }
          }
          
          return {
            workflowSteps: newSteps,
            workflowConnections: newConnections,
          };
        });
      },
      
      // Workflow Step Actions
      addWorkflowStep: (stepData) => {
        const id = `step_${Date.now()}`;
        const step: WorkflowStepEntity = {
          ...stepData,
          id,
          createdAt: new Date(),
        };
        
        set((state) => ({
          workflowSteps: new Map(state.workflowSteps).set(id, step),
        }));
        
        return id;
      },
      
      updateWorkflowStep: (stepId, updates) => {
        const { workflowSteps } = get();
        const step = workflowSteps.get(stepId);
        if (!step) return;
        
        const updatedStep = { ...step, ...updates };
        
        set((state) => ({
          workflowSteps: new Map(state.workflowSteps).set(stepId, updatedStep),
        }));
      },
      
      deleteWorkflowStep: (stepId) => {
        set((state) => {
          const newSteps = new Map(state.workflowSteps);
          newSteps.delete(stepId);
          return { workflowSteps: newSteps };
        });
      },
      
      // Connection Actions
      addWorkflowConnection: (connectionData) => {
        const id = `connection_${Date.now()}`;
        const connection: WorkflowConnectionEntity = {
          ...connectionData,
          id,
          createdAt: new Date(),
        };
        
        set((state) => ({
          workflowConnections: new Map(state.workflowConnections).set(id, connection),
        }));
        
        return id;
      },
      
      deleteWorkflowConnection: (connectionId) => {
        set((state) => {
          const newConnections = new Map(state.workflowConnections);
          newConnections.delete(connectionId);
          return { workflowConnections: newConnections };
        });
      },
    }),
    { name: 'business-store' }
  )
); 