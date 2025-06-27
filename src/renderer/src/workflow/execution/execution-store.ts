// 工作流执行数据存储

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ExecutionStore } from './workflow-engine';
import type {
  WorkflowExecutionEntity,
  StepExecutionEntity,
  ExecutionLogEntity,
} from '../domain/entities';

interface ExecutionStoreState {
  // Execution Data
  executions: Map<string, WorkflowExecutionEntity>;
  stepExecutions: Map<string, StepExecutionEntity>;
  executionLogs: Map<string, ExecutionLogEntity[]>;
  
  // Current Execution Context
  currentExecutionId: string | null;
  
  // Real-time Step Status Tracking
  currentStepStatuses: Map<string, {
    stepId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress?: number;
    startTime?: Date;
    error?: string;
  }>;
  
  // Store Actions
  createExecution: (execution: Omit<WorkflowExecutionEntity, 'id'>) => Promise<WorkflowExecutionEntity>;
  updateExecution: (id: string, updates: Partial<WorkflowExecutionEntity>) => Promise<void>;
  getExecution: (id: string) => Promise<WorkflowExecutionEntity>;
  
  createStepExecution: (stepExecution: Omit<StepExecutionEntity, 'id'>) => Promise<StepExecutionEntity>;
  updateStepExecution: (id: string, updates: Partial<StepExecutionEntity>) => Promise<void>;
  
  createLog: (log: Omit<ExecutionLogEntity, 'id'>) => Promise<ExecutionLogEntity>;
  getExecutionLogs: (executionId: string) => ExecutionLogEntity[];
  
  // Real-time Step Status Actions
  updateStepStatus: (stepId: string, status: ExecutionStoreState['currentStepStatuses'] extends Map<string, infer T> ? T : never) => void;
  getStepStatus: (stepId: string) => ExecutionStoreState['currentStepStatuses'] extends Map<string, infer T> ? T | undefined : never;
  clearStepStatuses: () => void;
  
  // Execution Control
  setCurrentExecution: (executionId: string | null) => void;
  clearExecutionHistory: () => void;
}

export const useExecutionStore = create<ExecutionStoreState>()(
  devtools(
    (set, get) => ({
      // Initial State
      executions: new Map(),
      stepExecutions: new Map(),
      executionLogs: new Map(),
      currentExecutionId: null,
      currentStepStatuses: new Map(),
      
      // Execution Actions
      createExecution: async (executionData) => {
        const id = `exec_${Date.now()}`;
        const execution: WorkflowExecutionEntity = {
          ...executionData,
          id,
        };
        
        set((state) => ({
          executions: new Map(state.executions).set(id, execution),
        }));
        
        return execution;
      },
      
      updateExecution: async (id, updates) => {
        const { executions } = get();
        const execution = executions.get(id);
        
        if (!execution) {
          throw new Error(`Execution not found: ${id}`);
        }
        
        const updatedExecution = { ...execution, ...updates };
        
        set((state) => ({
          executions: new Map(state.executions).set(id, updatedExecution),
        }));
      },
      
      getExecution: async (id) => {
        const { executions } = get();
        const execution = executions.get(id);
        
        if (!execution) {
          throw new Error(`Execution not found: ${id}`);
        }
        
        return execution;
      },
      
      // Step Execution Actions
      createStepExecution: async (stepExecutionData) => {
        const id = `step_exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const stepExecution: StepExecutionEntity = {
          ...stepExecutionData,
          id,
        };
        
        set((state) => ({
          stepExecutions: new Map(state.stepExecutions).set(id, stepExecution),
        }));
        
        return stepExecution;
      },
      
      updateStepExecution: async (id, updates) => {
        const { stepExecutions } = get();
        const stepExecution = stepExecutions.get(id);
        
        if (!stepExecution) {
          throw new Error(`Step execution not found: ${id}`);
        }
        
        const updatedStepExecution = { ...stepExecution, ...updates };
        
        set((state) => ({
          stepExecutions: new Map(state.stepExecutions).set(id, updatedStepExecution),
        }));
      },
      
      // Log Actions
      createLog: async (logData) => {
        const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const log: ExecutionLogEntity = {
          ...logData,
          id,
        };
        
        set((state) => {
          const newLogs = new Map(state.executionLogs);
          const executionLogs = newLogs.get(log.executionId) || [];
          newLogs.set(log.executionId, [...executionLogs, log]);
          
          return { executionLogs: newLogs };
        });
        
        return log;
      },
      
      getExecutionLogs: (executionId) => {
        const { executionLogs } = get();
        return executionLogs.get(executionId) || [];
      },
      
      // Real-time Step Status Actions
      updateStepStatus: (stepId, status) => {
        set((state) => {
          const newStatuses = new Map(state.currentStepStatuses);
          newStatuses.set(stepId, status);
          return { currentStepStatuses: newStatuses };
        });
      },
      
      getStepStatus: (stepId) => {
        const { currentStepStatuses } = get();
        return currentStepStatuses.get(stepId);
      },
      
      clearStepStatuses: () => {
        set({ currentStepStatuses: new Map() });
      },
      
      // Execution Control
      setCurrentExecution: (executionId) => {
        set({ currentExecutionId: executionId });
      },
      
      clearExecutionHistory: () => {
        set({
          executions: new Map(),
          stepExecutions: new Map(),
          executionLogs: new Map(),
          currentExecutionId: null,
          currentStepStatuses: new Map(),
        });
      },
    }),
    { name: 'execution-store' }
  )
);

// 创建ExecutionStore实例
export function createExecutionStoreInstance(): ExecutionStore {
  const store = useExecutionStore.getState();
  
  return {
    createExecution: store.createExecution,
    updateExecution: store.updateExecution,
    getExecution: store.getExecution,
    createStepExecution: store.createStepExecution,
    updateStepExecution: store.updateStepExecution,
    createLog: store.createLog,
  };
} 