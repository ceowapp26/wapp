"use client";
import React, { useCallback, useEffect, useState } from "react";
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { useModelStore } from "@/stores/features/models/store";
import { useSubmit } from "@/hooks/use-submit";
import { useAdvancedSubmit } from "@/hooks/use-advanced-submit";
import { useAIImage } from "@/hooks/use-ai-image";
import { useAIPortal } from "@/hooks/use-ai-portal";
import { useEmailGenerator } from "@/hooks/use-email-generator";
import { ChatInterface, MessageInterface } from "@/types/chat";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed, determineModel } from '@/utils/aiUtils';
import { useGeneralContext } from "@/context/general-context-provider";
import { ModelOption, TimeLimitTokenUsed, WarningType } from "@/app/types/ai";
import { defaultModel } from "@/constants/ai";
import { toast } from "sonner";
import axios from 'axios';
import { useToken } from "./use-token";

export type ChatContext = "general" | "selection" | "page" | "q&a";

const convertToMessageInterface = (
  role: string,
  command: string,
  content: string,
  context: ChatContext,
  model: ModelOption
): MessageInterface => ({
  role,
  command,
  content,
  context,
  model,
});

interface AIDynamicProps {
  option?: string;
  prompt?: string;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowWarning?: React.Dispatch<React.SetStateAction<boolean>>;
  setWarningType?: React.Dispatch<React.SetStateAction<WarningType>>;
  setNextTimeUsage?:React.Dispatch<React.SetStateAction<string>>;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  setTitle?: React.Dispatch<React.SetStateAction<string>>;
  setDescription?: React.Dispatch<React.SetStateAction<string>>;
  setResData?: React.Dispatch<React.SetStateAction<string>>;
  setEmailSubject?: React.Dispatch<React.SetStateAction<string>>;
  setEmailText?: React.Dispatch<React.SetStateAction<string>>;
  onSendMessage?: () => void;
}

export const useDynamicSubmit = ({
  option,
  prompt,
  setIsLoading,
  setShowWarning,
  setWarningType,
  setNextTimeUsage,
  setError,
  setTitle,
  setDescription,
  setResData,
  setEmailSubject,
  setEmailText,
  onSendMessage,
  chatSession,
}: AIDynamicProps = {}) => { 
  const chats = usePortalStore((state) => state.chats);
  const chatModel = usePortalStore((state) => state.chatModel) as ModelOption | undefined;
  const chatContext = usePortalStore((state) => state.chatContext) as ModelOption | undefined;
  const setGenerating = usePortalStore((state) => state.setGenerating);
  const generating = usePortalStore((state) => state.generating);
  const currentChatIndex = usePortalStore((state) => state.currentChatIndex);
  const setChats = usePortalStore((state) => state.setChats);
  const _setError = usePortalStore((state) => state.setError);
  const inputContext = useModelStore((state) => state.inputContext) as ChatContext | undefined;
  const inputModel = useModelStore((state) => state.inputModel) as ModelOption | undefined;
  const _apiEndpoint = useModelStore((state) => state.apiEndpoint);
  const AIConfig = useModelStore((state) => state.AIConfig);
  const timeLimitTokenUsed = useModelStore((state) => state.timeLimitTokenUsed);
  const setTimeLimitTokenUsed = useModelStore((state) => state.setTimeLimitTokenUsed);
  const totalTokenUsed = useModelStore((state) => state.totalTokenUsed);
  const setAIConfig = useModelStore((state) => state.setAIConfig);
  const countTotalTokens = useModelStore((state) => state.countTotalTokens);
  const askQuestionOpenAi = useAction(api.chats.askQuestionOpenAi);
  const askQuestionGoogleGemini = useAction(api.chats.askQuestionGoogleGemini);
  const { handleSubmit, handleStop } = useSubmit();
  const { handlAdvancedSubmit } = useAdvancedSubmit({ option: option, prompt: prompt, setIsLoading: setIsLoading, setShowWarning: setShowWarning, setWarningType: setWarningType, setNextTimeUsage: setNextTimeUsage, setResData: setResData, setError: setError });
  const { handleAIPortal } = useAIPortal({ option: option, prompt: prompt, setIsLoading: setIsLoading, setShowWarning: setShowWarning, setWarningType: setWarningType, setNextTimeUsage: setNextTimeUsage, onSendMessage: onSendMessage, setError: setError });
  const { handleGenerateEmail } = useEmailGenerator({ prompt: prompt, setIsLoading: setIsLoading, setShowWarning: setShowWarning, setWarningType: setWarningType, setNextTimeUsage: setNextTimeUsage, setResData: setResData, setError: setError, setEmailSubject: setEmailSubject, setEmailText: setEmailText });
  const { handleAIImage } = useAIImage({ option: option, prompt: prompt, setIsLoading: setIsLoading, setShowWarning: setShowWarning, setWarningType: setWarningType, setNextTimeUsage: setNextTimeUsage, setResData: setResData, setError: setError });
  const updateChat = useMutation(api.chats.updateChat);
  const currentUser = useQuery(api.users.getCurrentUser);
  const createModel = useMutation(api.models.createModel);
  const updateModel = useMutation(api.models.updateModel);
  const generateDocumentDescription = useAction(api.documents.generateDocumentDescription);
  const generateDocumentTitle = useAction(api.documents.generateDocumentTitle);
  const generateChatDescription = useAction(api.chats.generateChatDescription);
  const generateChatTitle = useAction(api.chats.generateChatTitle);
  const { aiContext, inputType, outputType, setAiContext, selectedDocument, selectedChat, isSystemModel } = useGeneralContext();
  const models = useQuery(api.models.getAllModels);
  const { checkTokenUsage, updateTokenUsage } = useToken();

  async function checkSupportedLocation() {
    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const ip = ipResponse.data.ip;
      if (!ip) {
        console.error("Unable to determine client IP address");
        return false;
      }
      const locationResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
      const data = locationResponse.data;
      const supportedCountries = ['US', 'CA', 'GB', 'DE', 'FR'];
      const isLocationSupported = supportedCountries.includes(data.country_code);
      if (!isLocationSupported) {
        return new Response(JSON.stringify({
          error: "Country, region, or territory not supported",
          code: "unsupported_country_region_territory",
          type: "request_forbidden"
        }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ message: "Location supported" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      console.error("Error checking location support:", error);
      return new Response(JSON.stringify({
        error: "Internal Server Error",
        code: "internal_server_error",
        type: "server_error"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  async function handleLocationCheck() {
    const response = await checkSupportedLocation();
    if (response.status === 403) {
      try {
        const data = await response.json();
        setShowWarning && setShowWarning(true);
        if (response.status === 403 && data.error.includes('Country, region, or territory not supported')) {
          setWarningType && setWarningType('UNSUPPORTED');
        }
        setError(data.error);
      } catch (e) {
        toast.error('Failed to parse response');
      }
      return null;
    }
    return response;
  }

  const handleGenerateDocumentMetadata = useCallback(async ({
    setIsLoading,
    setError,
    setTitle,
    setDescription,
    setShowWarning,
    setWarningType,
    setNextTimeUsage
  }: AISelectorProps) => {
    setIsLoading && setIsLoading(true);
    setError && setError(null);
    const inputModelData = models?.find(model => model.model === inputModel);
    if (!inputModelData) {
      console.error("Input model data not found");
      return;
    }
    const handleAIResponse = async (result: any, setFunction: Function, promptType: string) => {
      if ('error' in result) {
        toast.error(result.error);
        setShowWarning && setShowWarning(true);
        setWarningType && setWarningType("CURRENT");
        setNextTimeUsage && setNextTimeUsage(result.nextAllowedTime);
        setError && setError(result.error);
        return false;
      }
      const { [`${promptType}Prompt`]: prompt, [promptType]: content, [`system${promptType}EmbeddingContent`]: embeddingContent } = result;
      setFunction && setFunction(content);
      const promptMessages: MessageInterface[] = [
        convertToMessageInterface("system", "", embeddingContent, inputContext, inputModel),
        convertToMessageInterface("user", "", prompt, inputContext, inputModel)
      ];
      const completionMessage = convertToMessageInterface("assistant", "", content, inputContext, inputModel);
      await updateTotalTokenUsed({
        model: inputModel,
        promptMessages,
        completionMessage,
        aiModel: determineModel(inputModel),
        inputType,
        outputType,
        inputModelData,
        updateModel
      });
      await updateTimeLimitTokenUsed({
        model: inputModel,
        promptMessages,
        completionMessage,
        aiModel: determineModel(inputModel),
        inputType,
        outputType,
        inputModelData,
        updateModel
      });
      await updateTokenUsage();
      
      return true;
    };

    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;
      const titleResult = await generateDocumentTitle({
        documentId: selectedDocument,
        configs: {
          model: inputModel,
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens
        }
      });
      const titleProcessed = await handleAIResponse(titleResult, setTitle, "title");
      if (!titleProcessed) return;
      const descriptionResult = await generateDocumentDescription({
        documentId: selectedDocument,
        configs: {
          model: inputModel,
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens
        }
      });
      await handleAIResponse(descriptionResult, setDescription, "description");
    } catch (error) {
      console.error("AI Generation failed", error);
      setError && setError("AI Generation failed. Please try again.");
      toast.error("AI Generation failed. Please try again.");
    } finally {
      setIsLoading && setIsLoading(false);
    }
  }, [
    models,
    inputModel,
    checkTokenUsage,
    generateDocumentTitle,
    generateDocumentDescription,
    selectedDocument,
    inputContext,
    inputType,
    outputType,
    updateTotalTokenUsed,
    updateTimeLimitTokenUsed,
    updateTokenUsage,
    updateModel,
    convertToMessageInterface,
    setIsLoading,
    setError,
    setTitle,
    setDescription,
    setShowWarning,
    setWarningType,
    setNextTimeUsage
  ]);

  const handleGenerateChatMetadata = useCallback(async ({
    setIsLoading,
    setError,
    setTitle,
    setDescription,
    setShowWarning,
    setWarningType,
    setNextTimeUsage
  }: AISelectorProps) => {
    setIsLoading && setIsLoading(true);
    setError && setError(null);
    const inputModelData = models?.find(model => model.model === inputModel);
    if (!inputModelData) {
      console.error("Input model data not found");
      return;
    }
    const processAIResponse = async (result: any, setFunction: Function, promptType: string) => {
      if ('error' in result) {
        toast.error(result.error);
        setShowWarning && setShowWarning(true);
        setWarningType && setWarningType("CURRENT");
        setNextTimeUsage && setNextTimeUsage(result.nextAllowedTime);
        setError && setError(result.error);
        return false;
      }
      const { [`${promptType}Prompt`]: prompt, [promptType]: content, [`system${promptType}EmbeddingContent`]: embeddingContent } = result;
      setFunction && setFunction(content);
      const promptMessages: MessageInterface[] = [
        convertToMessageInterface("system", "", embeddingContent, inputContext, inputModel),
        convertToMessageInterface("user", "", prompt, inputContext, inputModel)
      ];
      const completionMessage = convertToMessageInterface("assistant", "", content, inputContext, inputModel);
      await updateTotalTokenUsed({
        model: inputModel,
        promptMessages,
        completionMessage,
        aiModel: determineModel(inputModel),
        inputType,
        outputType,
        inputModelData,
        updateModel
      });
      await updateTimeLimitTokenUsed({
        model: inputModel,
        promptMessages,
        completionMessage,
        aiModel: determineModel(inputModel),
        inputType,
        outputType,
        inputModelData,
        updateModel
      });
      await updateTokenUsage();
      return true;
    };

    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;
      const titleResult = await generateChatTitle({
        chatId: selectedChat,
        configs: {
          model: inputModel,
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens
        }
      });
      const titleProcessed = await processAIResponse(titleResult, setTitle, "title");
      if (!titleProcessed) return;
      const descriptionResult = await generateChatDescription({
        chatId: selectedChat,
        configs: {
          model: inputModel,
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens
        }
      });
      await processAIResponse(descriptionResult, setDescription, "description");
    } catch (error) {
      console.error("AI Generation failed", error);
      setError && setError("AI Generation failed. Please try again.");
      toast.error("AI Generation failed. Please try again.");
    } finally {
      setIsLoading && setIsLoading(false);
    }
  }, [
    models,
    inputModel,
    checkTokenUsage,
    generateChatTitle,
    generateChatDescription,
    selectedChat,
    inputContext,
    inputType,
    outputType,
    updateTotalTokenUsed,
    updateTimeLimitTokenUsed,
    updateTokenUsage,
    updateModel,
    convertToMessageInterface,
    setIsLoading,
    setError,
    setTitle,
    setDescription,
    setShowWarning,
    setWarningType,
    setNextTimeUsage
  ]);

  const convexAIHandler = useCallback(async (func: any) => {
    if (usePortalStore.getState().generating || !chatContext || !chatModel || currentChatIndex === undefined) return;
    const updatedChats = JSON.parse(JSON.stringify(usePortalStore.getState().chats));
    const currentChat = updatedChats[currentChatIndex];
    const lastMessage = currentChat.messages[currentChat.messages.length - 1];
    const inputModelData = models?.find(model => model.model === chatModel);
    if (!inputModelData) {
      console.error("Input model data not found");
      return; 
    }
    if (lastMessage.role !== 'user') {
      toast.error("Last message is not from user. Cannot generate response.");
      return;
    }
    const newAssistantMessage = {
      role: 'assistant',
      command: '',
      content: '',
      context: chatContext,
      model: chatModel,
    };
    currentChat.messages = [...currentChat.messages, newAssistantMessage];
    await updateChat({ id: currentChat.cloudChatId, chatIndex: currentChat.chatIndex, chat: currentChat });
    setChats(updatedChats);
    setGenerating(true);
    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;
      const aiResponse = await func({ 
        chat: updatedChats[currentChatIndex],
        configs: {
          model: chatModel,
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        } 
      });
      if ('error' in aiResponse) {
        toast.error(aiResponse.error);
        setShowWarning && setShowWarning(true);
        setWarningType && setWarningType("CURRENT");
        setNextTimeUsage && setNextTimeUsage(aiResponse.nextAllowedTime);
        _setError(aiResponse.error);
        return;
      }
      const { response, systemEmbeddingContent } = aiResponse;
      if (response) {
        currentChat.messages[currentChat.messages.length - 1].content += response;
        setChats(updatedChats);
        await updateChat({ id: currentChat.cloudChatId, chatIndex: currentChat.chatIndex, chat: currentChat });
        const promptMessages: MessageInterface[] = [];
        const systemPromptMsg: MessageInterface = convertToMessageInterface("system", systemEmbeddingContent, "", chatContext, chatModel);
        promptMessages.push(systemPromptMsg, ...currentChat.messages.slice(0, -1));
        if (countTotalTokens) {
          await updateTotalTokenUsed({
            model: chatModel,
            aiModel: determineModel(chatModel),
            promptMessages: promptMessages,
            completionMessage: currentChat.messages[currentChat.messages.length - 1],
            inputType: inputType, 
            outputType: outputType,
            inputModelData: inputModelData,
            updateModel: updateModel,
          });
          await updateTimeLimitTokenUsed({
            model: chatModel,
            aiModel: determineModel(chatModel),
            promptMessages: promptMessages,
            completionMessage: currentChat.messages[currentChat.messages.length - 1],
            inputType: inputType, 
            outputType: outputType,
            inputModelData: inputModelData,
            updateModel: updateModel,
          });
          await updateTokenUsage();
        }
      }
    } catch (error) {
      console.error("Error in convexAIHandler:", error);
    } finally {
      setGenerating(false);
    }
  }, [
    chatContext,
    chatModel,
    currentChatIndex,
    models,
    checkTokenUsage,
    updateChat,
    setChats,
    setGenerating,
    setShowWarning,
    setWarningType,
    setNextTimeUsage,
    _setError,
    updateChat,
    countTotalTokens,
    updateTotalTokenUsed,
    updateTimeLimitTokenUsed,
    updateTokenUsage,
    convertToMessageInterface,
    inputType,
    outputType,
    updateModel,
    determineModel,
  ]);

  const handleAIDynamicFunc = useCallback(async () => {
    const modelToUse = isSystemModel ? inputModel : chatModel;
    let contextToUse = isSystemModel ? inputContext : chatContext;
    if (!modelToUse) {
      toast.error("No input model detected. Please select a valid model.");
      return;
    }
    if (!contextToUse) {
      toast.error("No context provided. Please provide the necessary context.");
      return;
    }
    const actions: Record<string, () => Promise<void>> = {
      "basic-document-openai": async () => {
        await convexAIHandler(askQuestionOpenAi);
      },
      "basic-document-gemini": async () => {
        await convexAIHandler(askQuestionGoogleGemini);
      },
      "basic-general-openai": async () => {
        await handleSubmit();
      },
      "basic-general-gemini": async () => {
        await handleSubmit();
      },
      "basic-general-claude": async () => {
        await handleSubmit();
      },
      "basic-selection-openai": async () => {
        await handleSubmit();
      },
      "basic-selection-gemini": async () => {
        await handleSubmit();     
      },
      "basic-file-openai": async () => {
        await handleSubmit();
      },
      "basic-project-openai": async () => {
        await handleSubmit();
      },
      "basic-file-gemini": async () => {
        await handleSubmit();
      },
      "basic-project-gemini": async () => {
        await handleSubmit();
      },
      "basic-file-claude": async () => {
        await handleSubmit();
      },
      "basic-project-claude": async () => {
        await handleSubmit();
      },
      "docMetadata-general-openai": async () => {
        await handleGenerateDocumentMetadata({ setIsLoading, setError, setTitle, setDescription, setShowWarning, setWarningType, setNextTimeUsage });
      },
      "chatMetadata-general-openai": async () => {
        await handleGenerateChatMetadata({ setIsLoading, setError, setTitle, setDescription, setShowWarning, setWarningType, setNextTimeUsage });
      },
      "email-general-openai": async () => {
        await handleGenerateEmail();
      },
      "advanced-general-openai": async () => {
        await handlAdvancedSubmit();
      },
      "portal-general-openai": async () => {
        await handleAIPortal();
      },
      "portal-general-anthropic": async () => {
        await handleAIPortal();
      },
      "portal-general-gemini": async () => {
        await handleAIPortal();
      },
      "image-general-dalle": async () => {
        await handleAIImage();
      },
    };
    const actionKey = `${aiContext || 'basic'}-${contextToUse || 'general'}-${determineModel(modelToUse) || 'openai'}`;
    const action = actions[actionKey];
    if (action) {
      try {
        await action();
      } catch (error) {
        console.error(`Error executing action for ${actionKey}:`, error);
      }
    } else {
      console.error(`No action found for key: ${actionKey}`);
    }
  }, [
    aiContext,
    isSystemModel,
    inputContext,
    inputModel,
    chatModel, 
    chatContext,
    currentChatIndex,
    askQuestionOpenAi,
    handleGenerateDocumentMetadata,
    handleGenerateChatMetadata,
    handleAIPortal,
    handleAIImage,
    handlAdvancedSubmit,
    handleGenerateEmail,
    convexAIHandler,
    askQuestionGoogleGemini,
    handleSubmit,
    setResData,
    prompt,
    option,
    setShowWarning,
    setWarningType,
    setNextTimeUsage,
    setIsLoading,
    setError,
    setEmailSubject,
    setEmailText,
    onSendMessage,
  ]);

  const handleStopChat = () => {
    handleStop();
  }

  return { handleAIDynamicFunc, handleStopChat };
};

 