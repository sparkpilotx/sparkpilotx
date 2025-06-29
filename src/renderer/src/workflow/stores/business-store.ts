// 业务数据Store - 管理纯业务数据，不关心UI

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AIModelEntity,
  DataProcessorEntity,
  AnnotationEntity,
  NodeEntity,
  WorkflowEntity,
  WorkflowStepEntity,
  WorkflowConnectionEntity,
} from '../domain/entities';

interface BusinessState {
  // Business Data Collections
  aiModels: Map<string, AIModelEntity>;
  dataProcessors: Map<string, DataProcessorEntity>;
  annotations: Map<string, AnnotationEntity>;
  workflows: Map<string, WorkflowEntity>;
  workflowSteps: Map<string, WorkflowStepEntity>;
  workflowConnections: Map<string, WorkflowConnectionEntity>;
  
  // Current Context
  currentWorkflowId: string | null;
  
  // Business Actions
  createAIModel: (model: Omit<AIModelEntity, 'id' | 'createdAt' | 'updatedAt' | 'executable'>) => string;
  updateAIModel: (id: string, updates: Partial<AIModelEntity>) => void;
  deleteAIModel: (id: string) => void;
  
  createDataProcessor: (processor: Omit<DataProcessorEntity, 'id' | 'createdAt' | 'updatedAt' | 'executable'>) => string;
  updateDataProcessor: (id: string, updates: Partial<DataProcessorEntity>) => void;
  deleteDataProcessor: (id: string) => void;

  createAnnotation: (annotation: Omit<AnnotationEntity, 'id' | 'createdAt' | 'updatedAt' | 'executable'>) => string;
  updateAnnotation: (id: string, updates: Partial<AnnotationEntity>) => void;
  deleteAnnotation: (id: string) => void;
  
  createWorkflow: (workflow: Omit<WorkflowEntity, 'id' | 'createdAt' | 'updatedAt'>) => string;
  setCurrentWorkflow: (workflowId: string | null) => void;
  clearCurrentWorkflow: () => void;
  
  addWorkflowStep: (step: Omit<WorkflowStepEntity, 'id' | 'createdAt' | 'executable'>) => string;
  updateWorkflowStep: (stepId: string, updates: Partial<WorkflowStepEntity>) => void;
  deleteWorkflowStep: (stepId: string) => void;
  
  addWorkflowConnection: (connection: Omit<WorkflowConnectionEntity, 'id' | 'createdAt'>) => string;
  deleteWorkflowConnection: (connectionId: string) => void;

  // Helper methods for node entity operations
  getNodeEntity: (entityType: string, entityId: string) => NodeEntity | undefined;
  validateConnection: (sourceStepId: string, targetStepId: string) => { valid: boolean; reason?: string };
}

export const useBusinessStore = create<BusinessState>()(
  devtools(
    (set, get) => ({
      // Initial State
      aiModels: new Map(),
      dataProcessors: new Map(),
      annotations: new Map(),
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
          executable: true,
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
          executable: true,
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

      // Annotation Actions
      createAnnotation: (annotationData) => {
        const id = `annotation_${Date.now()}`;
        const annotation: AnnotationEntity = {
          ...annotationData,
          id,
          executable: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          annotations: new Map(state.annotations).set(id, annotation),
        }));
        
        return id;
      },
      
      updateAnnotation: (id, updates) => {
        const { annotations } = get();
        const annotation = annotations.get(id);
        if (!annotation) return;
        
        const updatedAnnotation = {
          ...annotation,
          ...updates,
          updatedAt: new Date(),
        };
        
        set((state) => ({
          annotations: new Map(state.annotations).set(id, updatedAnnotation),
        }));
      },
      
      deleteAnnotation: (id) => {
        set((state) => {
          const newAnnotations = new Map(state.annotations);
          newAnnotations.delete(id);
          return { annotations: newAnnotations };
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
        
        // Determine executable status from entity
        const entityExecutable = get().getNodeEntity(stepData.entityType, stepData.entityId)?.executable ?? false;
        
        const step: WorkflowStepEntity = {
          ...stepData,
          id,
          executable: entityExecutable,
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
        const validation = get().validateConnection(connectionData.sourceStepId, connectionData.targetStepId);
        if (!validation.valid) {
          console.warn(`Invalid connection: ${validation.reason}`);
          return '';
        }

        const id = `connection_${Date.now()}`;
        const connection: WorkflowConnectionEntity = {
          ...connectionData,
          id,
          connectionType: 'execution', // Default to execution for valid connections
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

      // Helper Methods
      getNodeEntity: (entityType, entityId) => {
        const { aiModels, dataProcessors, annotations } = get();
        
        switch (entityType) {
          case 'aiModel':
            return aiModels.get(entityId);
          case 'dataProcessor':
            return dataProcessors.get(entityId);
          case 'annotation':
            return annotations.get(entityId);
          default:
            return undefined;
        }
      },

      validateConnection: (sourceStepId, targetStepId) => {
        const { workflowSteps } = get();
        const sourceStep = workflowSteps.get(sourceStepId);
        const targetStep = workflowSteps.get(targetStepId);
        
        if (!sourceStep || !targetStep) {
          return { valid: false, reason: 'One or both steps do not exist' };
        }
        
        // Only executable steps can participate in execution connections
        if (!sourceStep.executable || !targetStep.executable) {
          return { 
            valid: false, 
            reason: 'Both source and target steps must be executable to form an execution connection' 
          };
        }
        
        return { valid: true };
      },
    }),
    { name: 'business-store' }
  )
); 