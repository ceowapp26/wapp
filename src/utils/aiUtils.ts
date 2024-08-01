import { ModelOption, Model, TotalTokenUsed, TimeLimitTokenUsed } from "@/types/ai"; 
import { MessageInterface } from '@/types/chat';
import { useStore } from '@/redux/features/apps/document/store';
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

const formatAndCountTokens = async (
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
  const geminiModel = genAI.getGenerativeModel({
    model: model,
  });
  switch (inputType) {
    case "text-only": {
      return formatAndCountTokens(geminiModel, messages);
    }
    case "text-image": {
      let totalTokens = formatAndCountTokens(geminiModel, messages);
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

export const getCountTokensFunc = (aiModel: Model, messages: MessageInterface[], model: ModelOption, inputType?: InputType, outputType?: OutputType, inputImage?: any) => {
  if (aiModel === 'gemini') {
    return countTokensGoogleGemini(inputType, inputImage, messages, model);
  } else {
    return countTokensOpenAi(outputType, messages, model);
  }
};

export const limitMessageTokens = (
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
    const systemTokenCount = getCountTokensFunc(aiModel, [messages[0]], model, inputType, outputType);
    if (systemTokenCount < limit) {
      tokenCount += systemTokenCount;
      retainSystemMessage = true;
    }
  }
  // Iterate through messages in reverse order, adding them to the limitedMessages array
  // until the token limit is reached (excludes first message)
  for (let i = messages.length - 1; i >= 1; i--) {
    const count = getCountTokensFunc(aiModel, [messages[i]], model, inputType, outputType);
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
    const firstMessageTokenCount = getCountTokensFunc(aiModel, [messages[0]], model, inputType, outputType);
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
}: UpdateTokenUsedParams): Promise<void> => {
  const setTotalTokenUsed = useStore.getState().setTotalTokenUsed;
  const totalTokenUsed: TotalTokenUsed = JSON.parse(
    JSON.stringify(useStore.getState().totalTokenUsed)
  );
  const newPromptTokens = getCountTokensFunc(aiModel, promptMessages, model, inputType, outputType, inputImage);
  const newCompletionTokens = getCountTokensFunc(aiModel, [completionMessage], model, inputType, outputType, inputImage);
  
  if (!totalTokenUsed[model]) {
    totalTokenUsed[model] = { inputTokens: 0, outputTokens: 0 };
  }
  totalTokenUsed[model] = {
    inputTokens: totalTokenUsed[model].inputTokens + newPromptTokens,
    outputTokens: totalTokenUsed[model].outputTokens + newCompletionTokens,
  };
  const updatedCloudData = {
    ...inputModelData,
    totalTokenUsed: totalTokenUsed[model]
  };
  await updateModel({ id: inputModelData.cloudModelId, data: updatedCloudData });
  setTotalTokenUsed(totalTokenUsed);
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
}: UpdateTokenUsedParams): Promise<void> => {
  const setTimeLimitTokenUsed = useStore.getState().setTimeLimitTokenUsed;
  const timeLimitTokenUsed: TimeLimitTokenUsed = JSON.parse(
    JSON.stringify(useStore.getState().timeLimitTokenUsed)
  );
  const newPromptTokens = getCountTokensFunc(aiModel, promptMessages, model, inputType, outputType, inputImage);
  const newCompletionTokens = getCountTokensFunc(aiModel, [completionMessage], model, inputType, outputType, inputImage);
  const currentUsage = timeLimitTokenUsed[model];
  const updatedUsage = {
    inputTokens: [...currentUsage.inputTokens, newPromptTokens],
    outputTokens: [...currentUsage.outputTokens, newCompletionTokens],
    totalInputTokens: currentUsage.totalInputTokens + newPromptTokens,
    totalOutputTokens: currentUsage.totalOutputTokens + newCompletionTokens,
    isTokenExceeded: currentUsage.isTokenExceeded,
    remainingTokens: currentUsage.remainingTokens,
    lastTokenUpdateTime: currentUsage.lastTokenUpdateTime??Date.now(),
    tokenLimit: currentUsage.tokenLimit
  };
  const updatedCloudData = {
    ...inputModelData,
    timeLimitTokenUsed: updatedUsage
  };
  await updateModel({ id: inputModelData.cloudModelId, data: updatedCloudData });
  setTimeLimitTokenUsed({ ...timeLimitTokenUsed, [model]: updatedUsage });
  return updatedUsage;
};

export const determineModel = (model: ModelOption): string => {
  if (model.includes("gpt")) {
    return "openAI";
  } else if (model.includes("gemini")) {
    return "gemini";
  } else if (model.includes("dall")) {
    return "dalle";
  }
};

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




