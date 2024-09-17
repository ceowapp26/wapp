import { ModelOption, Model, TotalTokenUsed, TimeLimitTokenUsed, APIEndpointOption } from "@/types/ai"; 
import { modelMaxToken } from '@/constants/ai';
import { MessageInterface, FileInterface } from '@/types/chat';
import { useModelStore } from '@/stores/features/models/store';
import { Tiktoken } from '@dqbd/tiktoken/lite';
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
const cl100k_base = await import('@dqbd/tiktoken/encoders/cl100k_base.json');
import { InputType, OutputType, CloudModelConfigInterface } from "@/types/ai"; 
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface UpdateTokenUsedParams {
  model: ModelOption;
  promptMessages: MessageInterface[];
  completionMessage: MessageInterface;
  aiModel: Model;
  inputType?: InputType;
  outputType?: OutputType;
  inputImage?: any;
  claude_input_tokens?: number;
  claude_output_tokens?: number;
  inputModelData: CloudModelConfigInterface;
  updateModel: (params: { id: Id<"models">; data: Partial<CloudModelConfigInterface> }) => Promise<void>;
}

interface LimitMessageTokensParams {
  model: ModelOption;
  promptMessages: MessageInterface[];
  completionMessage: MessageInterface;
  aiModel: Model;
  inputType?: string;
  outputType?: string;
  inputImage?: any;
}

const encoder = new Tiktoken(
  cl100k_base.bpe_ranks,
  {
    ...cl100k_base.special_tokens,
    '<|im_start|>': 100264,
    '<|im_end|>': 100265,
    '<|im_sep|>': 100266,
  },
  cl100k_base.pat_str
);

export const getChatGPTEncoding = (
  messages: MessageInterface[],
  model: ModelOption
) => {
  const isGpt3 = model === 'gpt-3.5-turbo';
  const msgSep = isGpt3 ? '\n' : '';
  const roleSep = isGpt3 ? '\n' : '<|im_sep|>';
  const serialized = [
    messages
      .map(({ role, content }) => {
        return `<|im_start|>${role}${roleSep}${content}<|im_end|>`;
      })
      .join(msgSep),
    `<|im_start|>assistant${roleSep}`,
  ].join(msgSep);

  return encoder.encode(serialized, 'all');
};

export const countTokensOpenAi = (
  outputType?: OutputType,
  messages: MessageInterface[],
  model: ModelOption
): Promise<number> => {
  switch (outputType) {
    case "text":
      if (messages.length === 0) return 0;
      return getChatGPTEncoding(messages, model).length;
    case "image":
      return 1;
    default:
      throw new Error(`Unsupported ouput type: ${outputType}`);
  }
};

const formatAndCountGeminiTokens = async (
  geminiModel: any,
  messages: MessageInterface[]
): Promise<number> => {
  const formattedMessages = messages.map(({ role, content }) => ({
    role: role,
    parts: [{ text: content }],
  }));
  const chat = geminiModel.startChat({
    history: formattedMessages,
  });
  const countResult = await geminiModel.countTokens({
    contents: await chat.getHistory(),
  });
  return countResult.totalTokens;
};

export const countTokensGoogleGemini = async (
  inputType?: InputType,
  inputImage?: any,
  messages: MessageInterface[],
  model: ModelOption
): Promise<number> => {
  if (messages.length === 0) return 0;

  const messagesToCount = messages[0]?.role === 'system' ? messages.slice(1) : messages;
  
  if (messagesToCount.length === 0) return 0;

  const geminiModel = genAI.getGenerativeModel({
    model: model,
  });
  switch (inputType) {
    case "text-only": {
      return formatAndCountGeminiTokens(geminiModel, messagesToCount);
    }
    case "text-image": {
      let totalTokens = formatAndCountTokens(geminiModel, messagesToCount);
      if (inputImage) {
        const imageTokens = await geminiModel.countTokens({
          contents: [{ image: inputImage }],
        });
        totalTokens += imageTokens.totalTokens;
      }
      return totalTokens;
    }
    default:
      throw new Error(`Unsupported input type: ${inputType}`);
  }
};

const countTokens = (input: string): number => {
  const tokens = input
    .trim()
    .split(/\s+|(?=[.,!?;])|(?<=[.,!?;])/)
    .filter(token => token.length > 0); 

  return tokens.length;
};

const formatAndCountClaudeTokens = async (
  messages: MessageInterface[]
): Promise<number> => {
  if (messages.length === 0) return 0;
  const tokenCounts = await Promise.all(
    messages.map(async (message) => {
      return countTokens(message.content);
    })
  );

  return tokenCounts.reduce((acc, tokens) => acc + tokens, 0); 
};

export const countTokensClaudeAi = (
  outputType?: OutputType,
  messages: MessageInterface[],
): Promise<number> => {
  switch (outputType) {
    case "text": {
      return formatAndCountClaudeTokens(messages);
    }
    case "image":
      return Promise.resolve(1);
    default:
      throw new Error(`Unsupported output type: ${outputType}`);
  }
};

export const getCountTokensFunc = async (aiModel: Model, messages: MessageInterface[], model: ModelOption, inputType?: InputType, outputType?: OutputType, inputImage?: any) => {
  if (aiModel === 'gemini') {
    return countTokensGoogleGemini(inputType, inputImage, messages, model);
  } else if (aiModel === "openai") {
    return countTokensOpenAi(outputType, messages, model);
  } else if (aiModel === "claude") {
    return countTokensClaudeAi(outputType, messages);
  }
};

export const limitMessageTokens = async (
  messages: MessageInterface[],
  limit: number = 4096,
  model: ModelOption,
  aiModel: Model,
  inputType,
  outputType,
): Promise<MessageInterface[]> => {
  const limitedMessages: MessageInterface[] = [];
  let tokenCount = 0;
  const isSystemFirstMessage = messages[0]?.role === 'system';
  let retainSystemMessage = false;
  // Check if the first message is a system message and if it fits within the token limit
  if (isSystemFirstMessage) {
    const systemTokenCount = await getCountTokensFunc(aiModel, [messages[0]], model, inputType, outputType);
    if (systemTokenCount < limit) {
      tokenCount += systemTokenCount;
      retainSystemMessage = true;
    }
  }
  // Iterate through messages in reverse order, adding them to the limitedMessages array
  // until the token limit is reached (excludes first message)
  for (let i = messages.length - 1; i >= 1; i--) {
    const count = await getCountTokensFunc(aiModel, [messages[i]], model, inputType, outputType);
    if (count + tokenCount > limit) break;
    tokenCount += count;
    limitedMessages.unshift({ ...messages[i] });
  }
  // Process first message
  if (retainSystemMessage) {
    // Insert the system message in the third position from the end
    limitedMessages.splice(-3, 0, { ...messages[0] });
  } else if (!isSystemFirstMessage) {
    // Check if the first message (non-system) can fit within the limit
    const firstMessageTokenCount = await getCountTokensFunc(aiModel, [messages[0]], model, inputType, outputType);
    if (firstMessageTokenCount + tokenCount < limit) {
      limitedMessages.unshift({ ...messages[0] });
    }
  }
  return limitedMessages;
};

export const updateTotalTokenUsed = async ({
  model,
  promptMessages,
  completionMessage,
  aiModel,
  inputType,
  outputType,
  inputImage,
  inputModelData,
  updateModel,
  claude_input_tokens,
  claude_output_tokens,
}: UpdateTokenUsedParams): Promise<void> => {
  const setTotalTokenUsed = useModelStore.getState().setTotalTokenUsed;
  const totalTokenUsed: TotalTokenUsed = JSON.parse(
    JSON.stringify(useModelStore.getState().totalTokenUsed)
  );

  try {
    const newPromptTokens = await getCountTokensFunc(aiModel, promptMessages, model, inputType, outputType, inputImage);
    const newCompletionTokens = await getCountTokensFunc(aiModel, [completionMessage], model, inputType, outputType, inputImage);
    if (!totalTokenUsed[model]) {
      totalTokenUsed[model] = { inputTokens: 0, outputTokens: 0 };
    }
    const currentUsage = totalTokenUsed[model];
    const updatedUsage = {
      inputTokens: currentUsage.inputTokens + (aiModel === "claude" ? claude_input_tokens : newPromptTokens),
      outputTokens: currentUsage.outputTokens + (aiModel === "claude" ? claude_output_tokens : newCompletionTokens),
    };
    const updatedCloudData = {
      ...inputModelData,
      totalTokenUsed: updatedUsage,
    };

    await updateModel({ id: inputModelData.cloudModelId, data: updatedCloudData });
    setTotalTokenUsed({ ...totalTokenUsed, [model]: updatedUsage });
  } catch (error) {
    console.error('Error updating total token usage:', error);
    throw error;
  }
};

export const updateTimeLimitTokenUsed = async ({
  model,
  promptMessages,
  completionMessage,
  aiModel,
  inputType,
  outputType,
  inputImage,
  inputModelData,
  updateModel,
  claude_input_tokens,
  claude_output_tokens,
}: UpdateTokenUsedParams): Promise<void> => {
  const setTimeLimitTokenUsed = useModelStore.getState().setTimeLimitTokenUsed;
  const timeLimitTokenUsed: TimeLimitTokenUsed = JSON.parse(
    JSON.stringify(useModelStore.getState().timeLimitTokenUsed)
  );
  try {
    const newPromptTokens = await getCountTokensFunc(aiModel, promptMessages, model, inputType, outputType, inputImage);
    const newCompletionTokens = await getCountTokensFunc(aiModel, [completionMessage], model, inputType, outputType, inputImage);
    const currentUsage = timeLimitTokenUsed[model] || {
      inputTokens: [],
      outputTokens: [],
      totalInputTokens: 0,
      totalOutputTokens: 0,
      isTokenExceeded: false,
      remainingTokens: 0,
      lastTokenUpdateTime: Date.now(),
      tokenLimit: 0,
    };
    const updatedUsage = {
      inputTokens: [...currentUsage.inputTokens, aiModel === "claude" ? claude_input_tokens : newPromptTokens],
      outputTokens: [...currentUsage.outputTokens, aiModel === "claude" ? claude_output_tokens : newCompletionTokens],
      totalInputTokens: currentUsage.totalInputTokens + (aiModel === "claude" ? claude_input_tokens : newPromptTokens),
      totalOutputTokens: currentUsage.totalOutputTokens + (aiModel === "claude" ? claude_output_tokens : newCompletionTokens),
      isTokenExceeded: currentUsage.isTokenExceeded,
      remainingTokens: currentUsage.remainingTokens,
      lastTokenUpdateTime: Date.now(), // Update to current time
      tokenLimit: currentUsage.tokenLimit,
    };
    const updatedCloudData = {
      ...inputModelData,
      timeLimitTokenUsed: updatedUsage,
    };
    await updateModel({ id: inputModelData.cloudModelId, data: updatedCloudData });
    setTimeLimitTokenUsed({ ...timeLimitTokenUsed, [model]: updatedUsage });
  } catch (error) {
    console.error('Error updating time-limited token usage:', error);
    throw error;
  }
};

export const determineModel = (model: ModelOption): string => {
  if (model.includes("gpt")) {
    return "openai";
  } else if (model.includes("gemini")) {
    return "gemini";
  } else if (model.includes("claude")) {
    return "claude";
  } else if (model.includes("dall")) {
    return "dalle";
  }
  console.error(`Model not recognized: ${model}`);
};

export const getAPIEndpoint = (options: APIEndpointOption[], inputModel: ModelOption) => {
  const model = determineModel(inputModel);
  const endpointOption = options.find(option => option.key === model);
  if (endpointOption) {
    const endpoint = endpointOption.value;
    return endpoint;
  } else {
    console.error(`No API endpoint found for model: ${model}`);
    setError(`No API endpoint found for model: ${model}`);
    return null;
  }
};

export class ChatSession {
  private autoStrip: boolean;
  private autoSummarized: boolean;
  private messages: MessageInterface[];
  private maxTokens: number;
  private warning: boolean;

  constructor(model: string) {
    this.autoStrip = false;
    this.autoSummarized = false;
    this.messages = [];
    this.maxTokens = modelMaxToken[model] || 4096;
    this.warning = false;
  }

  private approximateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private getMessageTokens(message: MessageInterface): number {
    const contentTokens = this.approximateTokenCount(message.content);
    const embeddedTokens = message.embeddedContent.reduce((sum, file) => 
      sum + this.approximateTokenCount(file.content), 0);
    return contentTokens + embeddedTokens;
  }

  private getTotalTokens(): number {
    return this.messages.reduce((sum, message) => sum + this.getMessageTokens(message), 0);
  }

  addMessage(message: MessageInterface): void {
    const { context, model, ...strippedMessage } = message;
    this.messages.push(strippedMessage);

    if (this.getTotalTokens() > this.maxTokens) {
      if (!this.autoStrip && !this.autoSummarized) {
        this.showWarningModal();
      } else if (this.autoStrip) {
        this.stripMessages();
      } else if (this.autoSummarized) {
        this.summarizeMessages();
      }
    }
  }

  private showWarningModal(): void {
    this.warning = true;
  }

  private stripMessages(): void {
    while (this.getTotalTokens() > this.maxTokens && this.messages.length > 1) {
      this.messages.shift();
    }
  }

  private summarizeMessages(): void {
    const summaryLength = Math.floor(this.maxTokens * 0.1); // Use 10% of max tokens for summary
    let summary = "Summary of previous conversation:\n";
    let currentLength = this.approximateTokenCount(summary);

    for (let i = 0; i < this.messages.length; i++) {
      const message = this.messages[i];
      const messageContent = `${message.role}: ${message.content}\n`;
      const messageTokens = this.approximateTokenCount(messageContent);

      if (currentLength + messageTokens > summaryLength) {
        break;
      }

      summary += messageContent;
      currentLength += messageTokens;
    }

    const summaryMessage: MessageInterface = {
      role: 'system',
      content: summary,
      embeddedContent: [],
      command: '',
    };

    this.messages = [summaryMessage, ...this.messages.slice(-Math.floor(this.messages.length / 2))];
  }

  getMessages(): MessageInterface[] {
    return this.messages;
  }

  setAutoStrip(value: boolean): void {
    this.autoStrip = value;
  }

  setAutoSummarized(value: boolean): void {
    this.autoSummarized = value;
  }

  isWarning(): boolean {
    return this.warning;
  }

  handleAutoStrip(): void {
    this.autoStrip = true;
    this.stripMessages();
    this.warning = false;
  }

  handleAutoSummarize(): void {
    this.autoSummarized = true;
    this.summarizeMessages();
    this.warning = false;
  }

  handleCancel(): void {
    this.warning = false;
  }
}

export const testTokensChat = async (ModelOption, chat) => {
  const model = new GenerativeModel(ModelOption);
  console.log(model.countTokens(chat.history));
  const toContents = (content) => [{ role: "user", parts: content }];
  console.log(model.countTokens([...chat.history, ...toContents("What is the meaning of life?")]));
};

export const testTokensMultimodalImageInline = async (ModelOption, imagePath) => {
  const model = new GenerativeModel(ModelOption);
  const organ = new Image();
  organ.src = imagePath;
  console.log(model.countTokens(["Tell me about this instrument", organ]));
};

export const testTokensMultimodalImageFileApi = async (ModelOption, imagePath) => {
  const model = new GenerativeModel(ModelOption);
  const organUpload = await model.uploadFile(imagePath);
  console.log(model.countTokens(["Tell me about this instrument", organUpload]));
};

export const testTokensVideoAudioFileApi = async (ModelOption, audioPath) => {
  const model = new GenerativeModel(ModelOption);
  const audioUpload = await model.uploadFile(audioPath);
  console.log(model.countTokens(audioUpload));
};

export const testTokensCachedContent = async (ModelOption, documentPath) => {
  const model = new GenerativeModel(ModelOption);
  const document = await model.uploadFile(documentPath);
  const cache = await model.createCache({
    model: ModelOption,
    contents: [document],
  });
  console.log(await model.countTokens(cache));
  cache.delete(); // Clear cache
};

export const testTokensSystemInstruction = async (ModelOption, documentPath) => {
  const model = new GenerativeModel(ModelOption);
  const document = await model.uploadFile(documentPath);
  console.log(model.countTokens(document));
};

export const testTokensTools = async (ModelOption) => {
  const add = (a, b) => a + b;
  const subtract = (a, b) => a - b;
  const multiply = (a, b) => a * b;
  const divide = (a, b) => a / b;

  const toolModel = new GenerativeModel(
    ModelOption, { tools: [add, subtract, multiply, divide] }
  );

  console.log(
    toolModel.countTokens(
      "I have 57 cats, each owns 44 mittens, how many mittens is that in total?"
    )
  );
};

const runTest = async (testName, args) => {
  switch (testName) {
    case 'testTokensChat':
      await testTokensChat(...args);
      break;
    case 'testTokensMultimodalImageInline':
      await testTokensMultimodalImageInline(...args);
      break;
    case 'testTokensMultimodalImageFileApi':
      await testTokensMultimodalImageFileApi(...args);
      break;
    case 'testTokensVideoAudioFileApi':
      await testTokensVideoAudioFileApi(...args);
      break;
    case 'testTokensCachedContent':
      await testTokensCachedContent(...args);
      break;
    case 'testTokensSystemInstruction':
      await testTokensSystemInstruction(...args);
      break;
    case 'testTokensTools':
      await testTokensTools(...args);
      break;
    default:
      console.error('Unknown test name:', testName);
  }
};

// Example usage
// runTest('testTokensChat', ['models/gemini-1.5-flash', { history: [{ role: "user", parts: "Hi, my name is Bob." }, { role: "model", parts: "Hi Bob!" }] }]);
// runTest('testTokensMultimodalImageInline', ['models/gemini-1.5-flash', 'path/to/organ.jpg']);
// runTest('testTokensMultimodalImageFileApi', ['models/gemini-1.5-flash', 'path/to/organ.jpg']);
// runTest('testTokensVideoAudioFileApi', ['models/gemini-1.5-flash', 'path/to/sample.mp3']);
// runTest('testTokensCachedContent', ['models/gemini-1.5-flash', 'path/to/a11.txt']);
// runTest('testTokensSystemInstruction', ['models/gemini-1.5-flash', 'path/to/a11.txt']);
// runTest('test




