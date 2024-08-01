"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useStore } from "@/redux/features/apps/document/store";
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
}: AIDynamicProps = {}) => { 
  const inputContext = useStore((state) => state.inputContext) as ChatContext | undefined;
  const inputModel = useStore((state) => state.inputModel) as ModelOption | undefined;
  const chats = useStore((state) => state.chats);
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const setChats = useStore((state) => state.setChats);
  const _apiEndpoint = useStore((state) => state.apiEndpoint);
  const AIConfig = useStore((state) => state.AIConfig);
  const timeLimitTokenUsed = useStore((state) => state.timeLimitTokenUsed);
  const setTimeLimitTokenUsed = useStore((state) => state.setTimeLimitTokenUsed);
  const totalTokenUsed = useStore((state) => state.totalTokenUsed);
  const setAIConfig = useStore((state) => state.setAIConfig);
  const countTotalTokens = useStore((state) => state.countTotalTokens);
  const askQuestionOpenAi = useAction(api.chats.askQuestionOpenAi);
  const askQuestionGoogleGemini = useAction(api.chats.askQuestionGoogleGemini);
  const { handleSubmit } = useSubmit();
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
  const { aiContext, inputType, outputType, setAiContext, aiModel, setAiModel, selectedDocument, selectedChat } = useGeneralContext();
  const models = useQuery(api.models.getAllModels);
  const { checkTokenUsage, updateTokenUsage } = useToken();

  const handleGenerateDocumentMetadata = async ({ setIsLoading, setError, setTitle, setDescription, setShowWarning, setWarningType, setNextTimeUsage }: AISelectorProps) => {
    setIsLoading && setIsLoading(true);
    setError && setError(null);
    const inputModelData = models?.find(model => model.model === inputModel);
    if (!inputModelData) {
      console.error("Input model data not found");
      return; 
    }
    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;      
      const titleResult = await generateDocumentTitle({ 
        documentId: selectedDocument, 
        configs: {
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        }
      });
      if ('error' in titleResult) {
        toast.error(titleResult.error);
        setShowWarning && setShowWarning(true);
        setWarningType && setWarningType("CURRENT");
        setNextTimeUsage && setNextTimeUsage(titleResult.nextAllowedTime);
        return;
      }
      const { titlePrompt, title, systemTitleEmbeddingContent } = titleResult;
      setTitle && setTitle(title);
      const titlePromtMessages: MessageInterface[] = [];
      const titleSystemPromptMsg = convertToMessageInterface("system", "", systemTitleEmbeddingContent, inputContext, inputModel);
      const titleUserPromptMsg = convertToMessageInterface("user", "", titlePrompt, inputContext, inputModel);
      const titleCompletionMsg = convertToMessageInterface("assistant", "", title, inputContext, inputModel);
      titlePromtMessages.push(titleSystemPromptMsg, titleUserPromptMsg);
      await updateTotalTokenUsed({
        model: inputModel,
        promptMessages: titlePromtMessages,
        completionMessage: titleCompletionMsg,
        aiModel: aiModel,
        inputType: inputType, 
        outputType: outputType,
        inputModelData: inputModelData,
        updateModel: updateModel,
      });
      await updateTimeLimitTokenUsed({
        model: inputModel,
        promptMessages: titlePromtMessages,
        completionMessage: titleCompletionMsg,
        aiModel: aiModel,
        inputType: inputType, 
        outputType: outputType,
        inputModelData: inputModelData,
        updateModel: updateModel,
      });
      await updateTokenUsage();
      const descriptionResult = await generateDocumentDescription({ 
        documentId: selectedDocument, 
        configs: {
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        }
      });
      if ('error' in descriptionResult) {
        toast.error(descriptionResult.error);
        setShowWarning && setShowWarning(true);
        setWarningType && setWarningType("CURRENT");
        setNextTimeUsage && setNextTimeUsage(descriptionResult.nextAllowedTime);
        return;
      }
      const { descriptionPrompt, description, systemDescriptionEmbeddingContent } = descriptionResult;
      setDescription && setDescription(description);
      const descPromtMessages: MessageInterface[] = [];
      const descSystemPromptMsg = convertToMessageInterface("system", "", systemDescriptionEmbeddingContent, inputContext, inputModel);
      const descUserPromptMsg = convertToMessageInterface("user", "", descriptionPrompt, inputContext, inputModel);
      const descCompletionMsg = convertToMessageInterface("assistant", "", description, inputContext, inputModel);
      descPromtMessages.push(descSystemPromptMsg, descUserPromptMsg);
      await updateTotalTokenUsed({
        model: inputModel,
        promptMessages: descPromtMessages,
        completionMessage: descCompletionMsg,
        aiModel: aiModel,
        inputType: inputType, 
        outputType: outputType,
        inputModelData: inputModelData,
        updateModel: updateModel,
      });
      await updateTimeLimitTokenUsed({
        model: inputModel,
        promptMessages: descPromtMessages,
        completionMessage: descCompletionMsg,
        aiModel: aiModel,
        inputType: inputType, 
        outputType: outputType,
        inputModelData: inputModelData,
        updateModel: updateModel,
      });
      await updateTokenUsage();
    } catch (error) {
      console.error("AI Generation failed", error);
      setError && setError("AI Generation failed. Please try again.");
      toast.error("AI Generation failed. Please try again.");
    } finally {
      setIsLoading && setIsLoading(false);
    }
  };

   const handleGenerateChatMetadata = async ({ setIsLoading, setError, setTitle, setDescription, setShowWarning, setWarningType, setNextTimeUsage }: AISelectorProps) => {
    setIsLoading && setIsLoading(true);
    setError && setError(null);
    const inputModelData = models?.find(model => model.model === inputModel);
    if (!inputModelData) {
      console.error("Input model data not found");
      return; 
    }
    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;
      const titleResult = await generateChatTitle({ 
        chatId: selectedChat, 
        configs: {
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        }
      });
      if ('error' in titleResult) {
        toast.error(titleResult.error);
        setShowWarning && setShowWarning(true);
        setWarningType && setWarningType("CURRENT")
        setNextTimeUsage && setNextTimeUsage(titleResult.nextAllowedTime);
        return;
      }
      const { titlePrompt, title, systemTitleEmbeddingContent } = titleResult;
      setTitle && setTitle(title);
      const titlePromtMessages: MessageInterface[] = [];
      const titleSystemPromptMsg = convertToMessageInterface("system", "", systemTitleEmbeddingContent, inputContext, inputModel);
      const titleUserPromptMsg = convertToMessageInterface("user", "", titlePrompt, inputContext, inputModel);
      const titleCompletionMsg = convertToMessageInterface("assistant", "", title, inputContext, inputModel);
      titlePromtMessages.push(titleSystemPromptMsg, titleUserPromptMsg);
      await updateTotalTokenUsed({
        model: inputModel,
        promptMessages: titlePromtMessages,
        completionMessage: titleCompletionMsg,
        aiModel: aiModel,
        inputType: inputType, 
        outputType: outputType,
        inputModelData: inputModelData,
        updateModel: updateModel,
      });
      await updateTimeLimitTokenUsed({
        model: inputModel,
        promptMessages: titlePromtMessages,
        completionMessage: titleCompletionMsg,
        aiModel: aiModel,
        inputType: inputType, 
        outputType: outputType,
        inputModelData: inputModelData,
        updateModel: updateModel,
      });
      await updateTokenUsage();
      const descriptionResult = await generateChatDescription({ 
        chatId: selectedChat, 
        configs: {
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        }
      });

      if ('error' in descriptionResult) {
        toast.error(descriptionResult.error);
        setShowWarning && setShowWarning(true);
        setWarningType: setWarningType("CURRENT");
        setNextTimeUsage && setNextTimeUsage(descriptionResult.nextAllowedTime);
        return;
      }
      const { descriptionPrompt, description, systemDescriptionEmbeddingContent } = descriptionResult;
      setDescription && setDescription(description);
      const descPromtMessages: MessageInterface[] = [];
      const descSystemPromptMsg = convertToMessageInterface("system", "", systemDescriptionEmbeddingContent, inputContext, inputModel);
      const descUserPromptMsg = convertToMessageInterface("user", "", descriptionPrompt, inputContext, inputModel);
      const descCompletionMsg = convertToMessageInterface("assistant", "", description, inputContext, inputModel);
      descPromtMessages.push(descSystemPromptMsg, descUserPromptMsg);
      await updateTotalTokenUsed({
        model: inputModel,
        promptMessages: descPromtMessages,
        completionMessage: descCompletionMsg,
        aiModel: aiModel,
        inputType: inputType, 
        outputType: outputType,
        inputModelData: inputModelData,
        updateModel: updateModel,
      });
      await updateTimeLimitTokenUsed({
        model: inputModel,
        promptMessages: descPromtMessages,
        completionMessage: descCompletionMsg,
        aiModel: aiModel,
        inputType: inputType, 
        outputType: outputType,
        inputModelData: inputModelData,
        updateModel: updateModel,
      });
      await updateTokenUsage();
    } catch (error) {
      console.error("AI Generation failed", error);
      setError && setError("AI Generation failed. Please try again.");
      toast.error("AI Generation failed. Please try again.");
    } finally {
      setIsLoading && setIsLoading(false);
    }
  };

  const convexAIHandler = async (func: any) => {
    if (useStore.getState().generating || !inputContext || !inputModel || currentChatIndex === undefined) return;
    const updatedChats = JSON.parse(JSON.stringify(useStore.getState().chats));
    const currentChat = updatedChats[currentChatIndex];
    const lastMessage = currentChat.messages[currentChat.messages.length - 1];
    const inputModelData = models?.find(model => model.model === inputModel);
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
      context: inputContext,
      model: inputModel,
    };
    currentChat.messages = [...currentChat.messages, newAssistantMessage];
    await handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
    setChats(updatedChats);
    setGenerating(true);
    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;
      const { response, systemEmbeddingContent } = await func({ chat: updatedChats[currentChatIndex] });
      if (response) {
        currentChat.messages[currentChat.messages.length - 1].content += response;
        setChats(updatedChats);
        await updateChat({ id: currentChat.cloudChatId, chatIndex: currentChat.chatIndex, chat: currentChat });
        const promptMessages: MessageInterface[] = [];
        const systemPromptMsg: MessageInterface = convertToMessageInterface("system", systemEmbeddingContent, "", inputContext, inputModel);
        promptMessages.push(systemPromptMsg, ...currentChat.messages.slice(0, -1));
        if (countTotalTokens) {
          await updateTotalTokenUsed({
            model: inputModel,
            promptMessages: promptMessages,
            completionMessage: currentChat.messages[currentChat.messages.length - 1],
            aiModel: aiModel,
            inputType: inputType, 
            outputType: outputType,
            inputModelData: inputModelData,
            updateModel: updateModel,
          });
          await updateTimeLimitTokenUsed({
            model: inputModel,
            promptMessages: descPromtMessages,
            completionMessage: descCompletionMsg,
            aiModel: aiModel,
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
  };

  const handleAIDynamicFunc = useCallback(async () => {
    if (!inputContext || !inputModel) {
      return;
    }
    const actions: Record<string, () => Promise<void>> = {
      "basic-document-openAI": async () => {
        await convexAIHandler(askQuestionOpenAi);
      },
      "basic-document-gemini": async () => {
        await convexAIHandler(askQuestionGoogleGemini);
      },
      "basic-general-openAI": async () => {
        await handleSubmit();
      },
      "basic-general-gemini": async () => {
        await handleSubmit();
      },
      "basic-selection-openAI": async () => {
        await handleSubmit();
      },
      "basic-selection-gemini": async () => {
        await handleSubmit();     
      },
      "docMetadata-general-openAI": async () => {
        await handleGenerateDocumentMetadata({ setIsLoading, setError, setTitle, setDescription, setShowWarning, setWarningType, setNextTimeUsage });
      },
      "chatMetadata-general-openAI": async () => {
        await handleGenerateChatMetadata({ setIsLoading, setError, setTitle, setDescription, setShowWarning, setWarningType, setNextTimeUsage });
      },
      "email-general-openAI": async () => {
        await handleGenerateEmail();
      },
      "advanced-general-openAI": async () => {
        await handlAdvancedSubmit();
      },
      "portal-general-openAI": async () => {
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
    const actionKey = `${aiContext || 'basic'}-${inputContext || 'general'}-${determineModel(inputModel) || 'openAI'}`;
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
    inputContext,
    inputModel,
    currentChatIndex,
    askQuestionOpenAi,
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
  return { handleAIDynamicFunc };
};

 