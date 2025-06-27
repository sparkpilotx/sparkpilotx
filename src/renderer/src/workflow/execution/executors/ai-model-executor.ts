// AI模型步骤执行器

import type { StepExecutor, ExecutionContext } from '../workflow-engine';
import type { WorkflowStepEntity, AIModelEntity, DataProcessorEntity } from '../../domain/entities';

export class AIModelExecutor implements StepExecutor {
  canExecute(step: WorkflowStepEntity): boolean {
    return step.entityType === 'aiModel';
  }
  
  async execute(
    step: WorkflowStepEntity,
    entity: AIModelEntity | DataProcessorEntity,
    context: ExecutionContext
  ): Promise<Record<string, unknown>> {
    if (!this.canExecute(step)) {
      throw new Error(`AIModelExecutor cannot execute step of type: ${step.entityType}`);
    }
    
    const aiModel = entity as AIModelEntity;
    
    // 准备AI模型的输入
    const prompt = this.preparePrompt(step, context);
    
    // 根据提供商执行AI模型调用
    const result = await this.callAIModel(aiModel, prompt);
    
    return {
      response: result.response,
      tokenUsage: result.tokenUsage,
      model: aiModel.modelId,
      provider: aiModel.provider,
    };
  }
  
  private preparePrompt(step: WorkflowStepEntity, context: ExecutionContext): string {
    // 从step配置中获取prompt模板
    const promptTemplate = step.configuration.prompt as string || 'Process the following input: {{input}}';
    
    // 简单的模板替换
    let prompt = promptTemplate;
    
    // 替换输入变量
    prompt = prompt.replace(/\{\{input\}\}/g, JSON.stringify(context.input));
    
    // 替换前置步骤的输出
    context.stepOutputs.forEach((output, stepId) => {
      prompt = prompt.replace(
        new RegExp(`\\{\\{step_${stepId}\\}\\}`, 'g'),
        JSON.stringify(output)
      );
    });
    
    return prompt;
  }
  
  private async callAIModel(
    aiModel: AIModelEntity,
    prompt: string
  ): Promise<{ response: string; tokenUsage: number }> {
    // 这里需要根据提供商调用相应的API
    // 为了演示，我们返回模拟数据
    
    switch (aiModel.provider) {
      case 'openai':
        return await this.callOpenAI(aiModel, prompt);
      case 'anthropic':
        return await this.callAnthropic(aiModel, prompt);
      case 'google':
        return await this.callGoogle(aiModel, prompt);
      default:
        throw new Error(`Unsupported AI provider: ${aiModel.provider}`);
    }
  }
  
  private async callOpenAI(
    aiModel: AIModelEntity,
    prompt: string
  ): Promise<{ response: string; tokenUsage: number }> {
    // 模拟OpenAI API调用
    // 在实际实现中，这里会调用真实的OpenAI API
    
    console.log(`Calling OpenAI ${aiModel.modelId} with prompt:`, prompt);
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      response: `OpenAI ${aiModel.modelId} response to: ${prompt.substring(0, 50)}...`,
      tokenUsage: Math.floor(Math.random() * 1000) + 100,
    };
  }
  
  private async callAnthropic(
    aiModel: AIModelEntity,
    prompt: string
  ): Promise<{ response: string; tokenUsage: number }> {
    console.log(`Calling Anthropic ${aiModel.modelId} with prompt:`, prompt);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      response: `Anthropic ${aiModel.modelId} response to: ${prompt.substring(0, 50)}...`,
      tokenUsage: Math.floor(Math.random() * 800) + 80,
    };
  }
  
  private async callGoogle(
    aiModel: AIModelEntity,
    prompt: string
  ): Promise<{ response: string; tokenUsage: number }> {
    console.log(`Calling Google ${aiModel.modelId} with prompt:`, prompt);
    
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return {
      response: `Google ${aiModel.modelId} response to: ${prompt.substring(0, 50)}...`,
      tokenUsage: Math.floor(Math.random() * 600) + 60,
    };
  }
} 