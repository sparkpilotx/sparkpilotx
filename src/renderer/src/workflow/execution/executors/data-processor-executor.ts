// 数据处理器执行器

import type { StepExecutor, ExecutionContext } from '../workflow-engine';
import type { WorkflowStepEntity, DataProcessorEntity } from '../../domain/entities';

export class DataProcessorExecutor implements StepExecutor {
  canExecute(step: WorkflowStepEntity): boolean {
    return step.entityType === 'dataProcessor';
  }

  async execute(
    _step: WorkflowStepEntity,
    entity: DataProcessorEntity,
    context: ExecutionContext
  ): Promise<Record<string, unknown>> {
    console.log(`🔄 Executing data processor: ${entity.name} (${entity.type})`);
    
    // 获取输入数据
    const inputData = this.prepareInputData(context);
    
    // 根据处理器类型执行不同的操作
    const result = await this.processData(entity, inputData);
    
    console.log(`✅ Data processor completed: ${entity.name}`);
    return result;
  }

  private prepareInputData(
    context: ExecutionContext
  ): Record<string, unknown> {
    let inputData: Record<string, unknown> = { ...context.input };
    
    // 合并来自前置步骤的输出
    context.stepOutputs.forEach((output, _stepId) => {
      inputData = { ...inputData, ...output };
    });
    
    return inputData;
  }

  private async processData(
    processor: DataProcessorEntity,
    inputData: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    // 模拟处理延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (processor.type) {
      case 'filter':
        return this.filterData(inputData, processor);
      case 'transform':
        return this.transformData(inputData, processor);
      case 'validate':
        return this.validateData(inputData, processor);
      case 'aggregate':
        return this.aggregateData(inputData, processor);
      default:
        throw new Error(`Unsupported processor type: ${processor.type}`);
    }
  }

  private filterData(
    data: Record<string, unknown>,
    processor: DataProcessorEntity
  ): Record<string, unknown> {
    // 简单的过滤逻辑示例
    const filtered = Object.entries(data).filter(([_key, value]) => {
      // 过滤掉空值和未定义值
      return value !== null && value !== undefined && value !== '';
    });
    
    return {
      [`${processor.name}_filtered`]: Object.fromEntries(filtered),
      processorType: 'filter',
      processedAt: new Date().toISOString(),
      originalKeys: Object.keys(data).length,
      filteredKeys: filtered.length,
    };
  }

  private transformData(
    data: Record<string, unknown>,
    processor: DataProcessorEntity
  ): Record<string, unknown> {
    // 简单的转换逻辑示例
    const transformed: Record<string, unknown> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      // 将所有字符串转换为大写
      if (typeof value === 'string') {
        transformed[`${key}_transformed`] = value.toUpperCase();
      } else {
        transformed[`${key}_transformed`] = value;
      }
    });
    
    return {
      [`${processor.name}_transformed`]: transformed,
      processorType: 'transform',
      processedAt: new Date().toISOString(),
      transformedKeys: Object.keys(transformed).length,
    };
  }

  private validateData(
    data: Record<string, unknown>,
    processor: DataProcessorEntity
  ): Record<string, unknown> {
    // 简单的验证逻辑示例
    const validationResults: Record<string, boolean> = {};
    const errors: string[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      // 基本验证：检查是否为空
      const isValid = value !== null && value !== undefined && value !== '';
      validationResults[key] = isValid;
      
      if (!isValid) {
        errors.push(`Field '${key}' is invalid`);
      }
    });
    
    const isValid = errors.length === 0;
    
    return {
      [`${processor.name}_validation`]: {
        isValid,
        results: validationResults,
        errors,
        validatedAt: new Date().toISOString(),
      },
      processorType: 'validate',
      processedAt: new Date().toISOString(),
    };
  }

  private aggregateData(
    data: Record<string, unknown>,
    processor: DataProcessorEntity
  ): Record<string, unknown> {
    // 简单的聚合逻辑示例
    const numbers: number[] = [];
    const strings: string[] = [];
    let totalFields = 0;
    
    Object.values(data).forEach(value => {
      totalFields++;
      if (typeof value === 'number') {
        numbers.push(value);
      } else if (typeof value === 'string') {
        strings.push(value);
      }
    });
    
    const aggregation = {
      totalFields,
      numberFields: numbers.length,
      stringFields: strings.length,
      numberSum: numbers.reduce((sum, num) => sum + num, 0),
      numberAverage: numbers.length > 0 ? numbers.reduce((sum, num) => sum + num, 0) / numbers.length : 0,
      stringLengthTotal: strings.reduce((total, str) => total + str.length, 0),
    };
    
    return {
      [`${processor.name}_aggregation`]: aggregation,
      processorType: 'aggregate',
      processedAt: new Date().toISOString(),
    };
  }
} 