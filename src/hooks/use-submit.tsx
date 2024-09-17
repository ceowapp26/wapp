import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatInterface } from '@/types/chat';
import { useCompletion } from 'ai/react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import { limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed, determineModel } from '@/utils/aiUtils';
import { useToken } from './use-token';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { useModelStore } from '@/stores/features/models/store';
import { usePortalContext } from '@/context/portal-context-provider';
import { useGeneralContext } from '@/context/general-context-provider';
import { ModelOption, TotalTokenUsed, WarningType } from '@/types/ai';
import { chatAPIEndpointOptions } from '@/constants/ai';
import { MessageInterface } from '@/types/chat';
import { getAPIEndpoint } from '@/utils/aiUtils';

export type Context = 'general' | 'selection' | 'document' | 'q&a';

interface BasicAIProps {
  isCode?: boolean; 
}

export const useSubmit = ({}: BasicAIProps = {}) => { 
  const { t, i18n } = useTranslation('api');
  const error = usePortalStore((state) => state.error);
  const setError = usePortalStore((state) => state.setError);
  const setGenerating = usePortalStore((state) => state.setGenerating);
  const setCodeGenerator = usePortalStore((state) => state.setCodeGenerator);
  const setChats = usePortalStore((state) => state.setChats);
  const currentChatIndex = usePortalStore((state) => state.currentChatIndex);
  const chatModel = usePortalStore((state) => state.chatModel);
  const chatContext = usePortalStore((state) => state.chatContext);
  const chats = usePortalStore((state) => state.chats);
  const AIConfig = useModelStore((state) => state.AIConfig);
  const countTotalTokens = useModelStore((state) => state.countTotalTokens);
  const updateChat = useMutation(api.chats.updateChat);
  const updateModel = useMutation(api.models.updateModel);
  const { chatSession, currentFileContent, projectStructure } = usePortalContext();
  const { contextContent, inputType, outputType, showWarning, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
  const { checkTokenUsage, updateTokenUsage } = useToken();
  const models = useQuery(api.models.getAllModels);
  const claude_input_tokens = useRef(0);
  const claude_output_tokens = useRef(0);

  const handleUpdateCloudChat = async (id: Id<'chats'>, chatIndex: number, chat: ChatInterface) => {
    try {
      await updateChat({ id: id, chatIndex: chatIndex, chat: chat });
    } catch (error) {
      console.error('Error updating chat:', error);
      throw error;
    }
  };

  const { complete, stop } = useCompletion({
    api: getAPIEndpoint(chatAPIEndpointOptions, chatModel),
    onResponse: async (response) => {
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          console.error("Error parsing JSON:", e);
          errorData = { error: "An unexpected error occurred", status: response.status };
        }
        setError(errorData.error);
        switch (response.status) {
          case 429:
            setShowWarning?.(true);
            setWarningType?.('CURRENT');
            setNextTimeUsage?.(errorData.nextAllowedTime);
            break;
          case 403:
            if (errorData.error === "Unsupported region") {
              setShowWarning?.(true);
              setWarningType?.('UNSUPPORTED');
            } else {
              toast.error(errorData.error);
            }
            break;
          default:
            toast.error(errorData.error);
        }
        return null;
      }
      return response;
    },
    onFinish: (prompt, completion) => {
      setGenerating(false);
      setCodeGenerator(false);
    },
    onError: (e) => {
      setError(e.message);
      toast.error(e.message);
    },
  });

  const handleSubmit = useCallback(async () => {
    if (usePortalStore.getState().generating || !chatContext || !chatModel || currentChatIndex === undefined) return;
    const updatedChats = JSON.parse(JSON.stringify(usePortalStore.getState().chats));
    const currentChat = updatedChats[currentChatIndex];
    const lastMessage = currentChat.messages[currentChat.messages.length - 1];
    const inputModelData = models?.find((model) => model.model === chatModel);
    if (!inputModelData) {
      console.error('Input model data not found');
      return;
    }
    if (lastMessage.role !== 'user') {
      toast.error('Last message is not from user. Cannot generate response.');
      return;
    }    
    const newAssistantMessage: MessageInterface = {
      role: 'assistant',
      command: '',
      content: '',
      embeddedContent: [],
      context: chatContext,
      model: chatModel,
    };
    currentChat.messages = [...currentChat.messages, newAssistantMessage];
    await handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
    setChats(updatedChats);
    setGenerating(true);
    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;
      const messages = await limitMessageTokens(currentChat.messages, inputModelData.max_tokens, chatModel, determineModel(chatModel), inputType, outputType);
      if (messages.length === 0) {
        toast.error('Message exceeds max token!');
        return;
      }
      const currentChatSession = chatSession.getMessages();
      const getContextContent = () => {
        switch (chatContext) {
          case 'selection':
            return contextContent || '';
            
          case 'file':
            return currentFileContent || '';
            
          case 'project':
            return projectStructure || '';
            
          default:
            return '';
        }
      }
      const requestOption = {
        command: lastMessage.command || '',
        messages: currentChatSession, 
        model: chatModel,
        embeddedContent: lastMessage.embeddedContent,
        contextContent: getContextContent(),
        config: {
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        },
      };
      const completion = await complete(lastMessage.content, {
        body: requestOption,
      });
      if (!completion) {
        throw new Error('Failed to get completion');
      }
      const hasCompletion = completion.length > 0;
      if (hasCompletion && determineModel(chatModel) !== "claude") {
        currentChat.messages[currentChat.messages.length - 1].content += completion;
        await handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
        setChats(updatedChats);
        return completion;
      } else {
        currentChat.messages[currentChat.messages.length - 1].content += completion.content;
        await handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
        setChats(updatedChats);
        claude_input_tokens.current = completion.usage.input_tokens;
        claude_output_tokens.current = completion.usage.output_tokens; 
        return completion;
      }
    } catch (e: unknown) {
      const err = (e as Error).message;
      console.error("Error in POST request:", err);
      currentChat.messages.pop();
      await handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
      setChats(updatedChats);
      chatSession.addMessage({ role: currentChat.messages[currentChat.messages.length - 1].role, content: currentChat.messages[currentChat.messages.length - 1].content, embeddedContent: currentChat.messages[currentChat.messages.length - 1].embeddedContent });
      setGenerating(false);
      return;
    } finally {
      if (countTotalTokens) {
        await updateTotalTokenUsed({
          model: chatModel,
          promptMessages: [lastMessage],
          completionMessage: currentChat.messages[currentChat.messages.length - 1],
          aiModel: determineModel(chatModel),
          inputType: inputType,
          outputType: outputType,
          inputModelData: inputModelData,
          updateModel: updateModel,
          claude_input_tokens: claude_input_tokens.current || 0,
          claude_output_tokens: claude_output_tokens.current || 0,
        });
        await updateTimeLimitTokenUsed({
          model: chatModel,
          promptMessages: [lastMessage],
          completionMessage: currentChat.messages[currentChat.messages.length - 1],
          aiModel: determineModel(chatModel),
          inputType: inputType,
          outputType: outputType,
          inputModelData: inputModelData,
          updateModel: updateModel,
          claude_input_tokens: claude_input_tokens.current || 0,
          claude_output_tokens: claude_output_tokens.current || 0,
        });
        await updateTokenUsage();
      }
    }
  }, [
    currentChatIndex,
    chatModel,
    chatContext,
    setChats,
    setGenerating,
    setError,
    checkTokenUsage,
    updateTokenUsage,
    contextContent,
    inputType,
    outputType,
    showWarning,
    setShowWarning,
    setWarningType,
    setNextTimeUsage,
    updateChat,
    updateModel,
    models,
    complete,
    countTotalTokens,
    determineModel,
    limitMessageTokens,
    updateTotalTokenUsed,
    updateTimeLimitTokenUsed,
    claude_input_tokens,
    claude_output_tokens,
  ]);
  
  const handleStop = () => {
    setGenerating(false);
    stop(); 
  };
  
  return { handleSubmit, handleStop, error };
};