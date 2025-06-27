// ==================== Executable 节点核心接口 ====================

export type ExecutionStatus = 
  | 'idle'           // 空闲
  | 'pending'        // 等待执行
  | 'running'        // 执行中
  | 'completed'     // 完成
  | 'error'          // 错误
  | 'cancelled'      // 取消
  | 'skipped';       // 跳过

export type DataType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'object' 
  | 'array' 
  | 'file' 
  | 'stream'
  | 'any';

// ==================== 数据端口定义 ====================

export interface DataPort {
  id: string;
  name: string;
  dataType: DataType;
  required: boolean;
  description?: string;
  defaultValue?: unknown;
}

export interface InputPort extends DataPort {
  direction: 'input';
  acceptsMultiple?: boolean;  // 是否接受多个连接
}

export interface OutputPort extends DataPort {
  direction: 'output';
  canBroadcast?: boolean;     // 是否可以广播到多个节点
}

// ==================== 执行上下文 ====================

export interface ExecutionContext {
  // 执行环境
  sessionId: string;
  executionId: string;
  timestamp: number;
  
  // 执行配置
  config: {
    timeout?: number;           // 超时时间(ms)
    retryCount?: number;        // 重试次数
    priority?: number;          // 执行优先级
  };
  
  // 信号控制
  signals: {
    abort: AbortSignal;         // 中止信号
    pause: () => void;          // 暂停执行
    resume: () => void;         // 恢复执行
  };
}

// ==================== 执行结果 ====================

export interface ExecutionResult {
  status: ExecutionStatus;
  data?: Record<string, unknown>;     // 输出数据
  error?: ExecutionError;             // 错误信息
  startTime: number;
  endTime: number;
  duration: number;                   // 执行时长(ms)
}

export interface ExecutionError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  recoverable: boolean;               // 是否可恢复
  retryable: boolean;                // 是否可重试
}

// ==================== 可执行节点接口 ====================

export interface ExecutableNode {
  // 基础信息
  id: string;
  type: string;
  label: string;
  
  // 端口定义
  inputs: InputPort[];
  outputs: OutputPort[];
  
  // 执行配置
  config: Record<string, unknown>;
  
  // 执行状态
  status: ExecutionStatus;
  result?: ExecutionResult;
  
  // 执行依赖
  dependencies: string[];             // 依赖的其他节点ID
}

// ==================== 执行器接口 ====================

export interface NodeExecutor<TConfig = Record<string, unknown>, TResult = unknown> {
  // 节点类型标识
  readonly nodeType: string;
  
  // 执行前验证
  validate(
    config: TConfig, 
    inputs: Record<string, unknown>,
    context: ExecutionContext
  ): Promise<ValidationResult>;
  
  // 主要执行逻辑
  execute(
    config: TConfig,
    inputs: Record<string, unknown>, 
    context: ExecutionContext
  ): Promise<TResult>;
  
  // 取消执行
  cancel?(
    config: TConfig,
    context: ExecutionContext
  ): Promise<void>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ==================== 类型守卫 ====================

export function isExecutableNode(node: unknown): node is ExecutableNode {
  return typeof node === 'object' && 
         node !== null && 
         'id' in node && 
         'type' in node && 
         'inputs' in node && 
         'outputs' in node &&
         'status' in node;
}
