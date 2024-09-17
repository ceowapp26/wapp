import React, { useCallback, useRef } from 'react';
import { useCompletion } from 'ai/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed, determineModel } from '@/utils/aiUtils';
import { useToken } from './use-token';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { useModelStore } from '@/stores/features/models/store';
import { useGeneralContext } from '@/context/general-context-provider';
import { usePortalContext } from '@/context/portal-context-provider';
import { MessageInterface } from '@/types/chat';
import { chatAPIEndpointOptions } from '@/constants/ai';
import { getAPIEndpoint } from '@/utils/aiUtils';

interface useEditorSubmitProps {
  generating: boolean;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useEditorSubmit = ({
  generating,
  setGenerating,
  error,
  setError,
}: useEditorSubmitProps) => {
  const chatModel = usePortalStore((state) => state.chatModel);
  const chatContext = usePortalStore((state) => state.chatContext);
  const countTotalTokens = useModelStore((state) => state.countTotalTokens);
  const { chatHistory, setChatHistory, editorChatSession } = usePortalContext();
  const { contextContent, inputType, outputType, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
  const { checkTokenUsage, updateTokenUsage } = useToken();
  const updateModel = useMutation(api.models.updateModel);
  const models = useQuery(api.models.getAllModels);
  const chatHistoryRef = useRef(chatHistory);
  const claude_input_tokens = useRef(0);
  const claude_output_tokens = useRef(0);

  React.useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);

  const { complete, stop } = useCompletion({
    api: getAPIEndpoint(chatAPIEndpointOptions, chatModel),
    onResponse: async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "An unexpected error occurred", status: response.status }));
        setError(errorData.error);
        handleErrorResponse(response.status, errorData);
        return null;
      }
      return response;
    },
    onError: (e) => {
      setError(e.message);
      toast.error(e.message);
    },
  });

  const handleErrorResponse = (status: number, errorData: any) => {
    switch (status) {
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
  };

  const handleSubmit = useCallback(async () => {
    const currentChatHistory = chatHistoryRef.current;
    if (currentChatHistory.length === 0 || (currentChatHistory.length > 0 && currentChatHistory[currentChatHistory.length - 1].role !== 'user')) {
      console.warn("Chat history is empty or last message is not from user. Retrying...");
      setTimeout(() => {
        handleSubmit(); // Retry after a short delay
      }, 1000); // Retry after 1 second
      return; // Exit the current execution
    }
    if (generating || !chatContext || !chatModel) {
      console.warn("Chat context or model is missing, or generating is true.");
      return;
    }
    const lastMessage = currentChatHistory[currentChatHistory.length - 1];
    const inputModelData = models?.find((model) => model.model === chatModel);
    if (!inputModelData) {
      console.error('Input model data not found');
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
    setChatHistory(prev => [...prev, newAssistantMessage]);
    setGenerating(true);
    try {
      if (checkTokenUsage()) return;
      const messages = await limitMessageTokens(currentChatHistory, inputModelData.max_tokens, chatModel, determineModel(chatModel), inputType, outputType);
      if (messages.length === 0) {
        toast.error('Message exceeds max token!');
        return;
      }
      const currentChatSession = editorChatSession.getMessages();
      const requestOption = {
        command: lastMessage.command || '',
        messages: currentChatSession, 
        model: chatModel,
        embeddedContent: lastMessage.embeddedContent,
        contextContent: chatContext === 'selection' ? contextContent : '',
        config: {
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        },
      };
      const completion = await complete(lastMessage.content, { body: requestOption });
      if (!completion) throw new Error('Failed to get completion');
      const hasCompletion = completion.length > 0;
      if (hasCompletion && determineModel(chatModel) !== "claude") {
        setChatHistory(prev => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1].content = completion;
          return updatedHistory;
        });
        return completion;
      } else {
        setChatHistory(prev => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1].content = completion.content;
          return updatedHistory;
        });
        claude_input_tokens.current = completion.usage.input_tokens;
        claude_output_tokens.current = completion.usage.output_tokens; 
        return completion;
      }
    } catch (e: unknown) {
      console.error("Error in POST request:", (e as Error).message);
      setError((e as Error).message);
    } finally {
      setGenerating(false);
      if (countTotalTokens) {
        const lastAssistantMessage = currentChatHistory[currentChatHistory.length - 1];
        await updateTotalTokenUsed({
          model: chatModel,
          promptMessages: [lastMessage],
          completionMessage: lastAssistantMessage,
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
          completionMessage: lastAssistantMessage,
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
  }, [chatModel, chatContext, setGenerating, setError, checkTokenUsage, updateTokenUsage, contextContent, inputType, outputType, models, complete, countTotalTokens, determineModel, limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed, setChatHistory, updateModel, generating, editorChatSession, claude_input_tokens, claude_output_tokens]);

  const handleStop = () => {
    stop(); 
    setGenerating(false);
  };

  return { handleSubmit, handleStop, error };
};