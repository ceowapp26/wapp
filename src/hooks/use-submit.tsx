import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatInterface } from '@/types/chat';
import { useCompletion } from "ai/react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed, determineModel } from '@/utils/aiUtils';
import { useToken } from "./use-token";
import { useStore } from '@/redux/features/apps/document/store';
import { useGeneralContext } from '@/context/general-context-provider';
import { ModelOption, TotalTokenUsed, WarningType } from "@/types/ai"; 
import { MessageInterface } from '@/types/chat';

export type Context = 'general' | 'selection' | 'document' | 'q&a';

export const useSubmit = () => {  
  const { t, i18n } = useTranslation('api');
  const currentState = useStore.getState();
  const setError = useStore((state) => state.setError);
  const setGenerating = useStore((state) => state.setGenerating);
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const inputModel = useStore((state) => state.inputModel);
  const inputContext = useStore((state) => state.inputContext);
  const apiEndpoint = useStore((state) => state.apiEndpoint);
  const AIConfig = useStore((state) => state.AIConfig);
  const chats = useStore((state) => state.chats);
  const countTotalTokens = useStore((state) => state.countTotalTokens);
  const totalTokenUsed = useStore((state) => state.totalTokenUsed);
  const timeLimitTokenUsed = useStore((state) => state.timeLimitTokenUsed);
  const tokenShortage = useStore((state) => state.tokenShortage);
  const updateChat = useMutation(api.chats.updateChat);
  const updateModel = useMutation(api.models.updateModel);
  const { contextContent, inputType, outputType, showWarning, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
  const { checkTokenUsage, updateTokenUsage } = useToken();
  const models = useQuery(api.models.getAllModels);

  const handleUpdateCloudChat = async (id: Id<"chats">, chatIndex: number, chat: ChatInterface) => {
    try {
      await updateChat({ id: id , chatIndex: chatIndex, chat: chat });
    } catch (error) {
      console.error('Error updating chat:', error);
      throw error;
    }
  };

  if (!apiEndpoint || apiEndpoint.length === 0) throw new Error(t('noApiKeyWarning') as string);

  const { complete, stop } = useCompletion({
    api: apiEndpoint, 
     onResponse: (response) => {
      if (response.status === 429) {
        response.json().then(data => {
          setShowWarning && setShowWarning(true);
          setWarningType && setWarningType("CURRENT");
          setNextTimeUsage && setNextTimeUsage(data.nextAllowedTime);
          toast.error(data.error);
        }).catch(e => {
          toast.error("Failed to parse response");
        });
        return null; 
      }
      return response; 
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  
  const handleSubmit = async () => {
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
      const messages = limitMessageTokens(currentChat.messages, AIConfig[inputModel].max_tokens, determineModel(inputModel), inputModel, inputType, outputType);
      if (messages.length === 0) {
        toast.error("Message exceeds max token!");
        throw new Error('Message exceeds max token!');
        return;
      }
      let requestOption = {
        command: lastMessage.command || '',
        model: inputModel,
        contextContent: inputContext === 'selection' ? contextContent : '',
        config: {
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        }
      };
      const completion = await complete(lastMessage.content, {
        body: requestOption,
      });

      if (!completion) {
        throw new Error('Failed to get completion');
      }

      const hasCompletion = completion.length > 0;
      
      if (hasCompletion) {
        while (useStore.getState().generating) {
          currentChat.messages[currentChat.messages.length - 1].content += completion;
          await handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
          setChats(updatedChats);
          return completion;
        }
        if (useStore.getState().generating) {
          await stop();
        }
      }
    } catch (e: unknown) {
      const err = (e as Error).message;
      setError(err);
      currentChat.messages.pop();
      await handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
      setChats(updatedChats);
    } finally {
      setGenerating(false);
      if (currentState.countTotalTokens) {
        await updateTotalTokenUsed({
          model: inputModel,
          promptMessages: currentChat.messages.slice(0, -1),
          completionMessage: currentChat.messages[currentChat.messages.length - 1],
          aiModel: determineModel(inputModel),
          inputType: inputType, 
          outputType: outputType,
          inputModelData: inputModelData,
          updateModel: updateModel,
        });
        await updateTimeLimitTokenUsed({
          model: inputModel,
          promptMessages: currentChat.messages.slice(0, -1),
          completionMessage: currentChat.messages[currentChat.messages.length - 1],
          aiModel: determineModel(inputModel),
          inputType: inputType, 
          outputType: outputType,
          inputModelData: inputModelData,
          updateModel: updateModel,
        });
        await updateTokenUsage();
      }
    }
  };
  return { handleSubmit };
};

