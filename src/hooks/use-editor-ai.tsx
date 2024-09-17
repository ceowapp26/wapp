import React, { useCallback, useRef } from 'react';
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
import { editorAPIEndpointOptions } from '@/constants/ai';
import { getAPIEndpoint } from '@/utils/aiUtils';

interface useEditorAIProps {
  generating: boolean;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useEditorAI = ({
  generating,
  setGenerating,
  error,
  setError,
}: useEditorAIProps) => {
  const inputModel = useModelStore((state) => state.inputModel);
  const inputContext = useModelStore((state) => state.inputContext);
  const countTotalTokens = useModelStore((state) => state.countTotalTokens);
  const { chatConversation, setChatConversation } = usePortalContext();
  const { contextContent, inputType, outputType, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
  const { checkTokenUsage, updateTokenUsage } = useToken();
  const updateModel = useMutation(api.models.updateModel);
  const models = useQuery(api.models.getAllModels);
  const chatConversationRef = useRef(chatConversation);
  const claude_input_tokens = useRef(0);
  const claude_output_tokens = useRef(0);

  React.useEffect(() => {
    chatConversationRef.current = chatConversation;
  }, [chatConversation]);

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
    const currentChatHistory = chatConversationRef.current;
    if (currentChatHistory.length === 0 || (currentChatHistory.length > 0 && currentChatHistory[currentChatHistory.length - 1].role !== 'user')) {
      console.warn("Chat history is empty or last message is not from user. Retrying...");
      setTimeout(() => {
        console.log("Retrying handleSubmit...");
        handleSubmit(); // Retry after a short delay
      }, 1000); // Retry after 1 second
      return; // Exit the current execution
    }
    if (generating || !inputContext || !inputModel) {
      console.warn("Chat context or model is missing, or generating is true.");
      return;
    }
    const lastMessage = currentChatHistory[currentChatHistory.length - 1];
    const inputModelData = models?.find((model) => model.model === inputModel);
    if (!inputModelData) {
      console.error('Input model data not found');
      return; 
    }
    const newAssistantMessage: MessageInterface = {
      role: 'assistant',
      command: '',
      content: '',
      embeddedContent: [],
      context: inputContext,
      model: inputModel,
    };
    setChatConversation(prev => {
      if (prev[prev.length - 1]?.content !== newAssistantMessage.content) {
        return [...prev, newAssistantMessage];
      }
      return prev; 
    });
    setGenerating(true);
    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;
      const messages = await limitMessageTokens(currentChatHistory, inputModelData.max_tokens, inputModel, determineModel(inputModel), inputType, outputType);
      if (messages.length === 0) {
        toast.error('Message exceeds max token!');
        return;
      }
      const requestOption = {
        command: lastMessage.command || '',
        messages: [],
        model: inputModel,
        embeddedContent: lastMessage.embeddedContent,
        contextContent: inputContext === 'selection' ? contextContent : '',
        config: {
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        },
      };

      // Replaced the complete function with a fetch call
      const response = await fetch(getAPIEndpoint(editorAPIEndpointOptions, inputModel), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: lastMessage.content,
          command: requestOption.command,
          messages: requestOption.messages,
          model: requestOption.model,
          embeddedContent: requestOption.embeddedContent,
          contextContent: requestOption.contextContent,
          config: requestOption.config,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        handleErrorResponse(response.status, errorData);
        return null;
      }
      const completion = await response.json();
      if (completion) {
        setChatConversation(prev => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1].content = completion.content;
          return updatedHistory;
        });
        if (determineModel(inputModel) === "claude") {
          claude_input_tokens.current = completion.usage.input_tokens;
          claude_output_tokens.current = completion.usage.output_tokens;
        }
        return completion;
      }
    } catch (e: unknown) {
      console.error("Error in POST request:", (e as Error).message);
      return;      
    } finally {
      setGenerating(false);
      if (countTotalTokens) {
        console.log("this is currentChatHistory", currentChatHistory)
        const lastAssistantMessage = currentChatHistory[currentChatHistory.length - 1];
        await updateTotalTokenUsed({
          model: inputModel,
          promptMessages: [lastMessage],
          completionMessage: lastAssistantMessage,
          aiModel: determineModel(inputModel),
          inputType: inputType,
          outputType: outputType,
          inputModelData: inputModelData,
          updateModel: updateModel,
          claude_input_tokens: claude_input_tokens.current || 0,
          claude_output_tokens: claude_output_tokens.current || 0,
        });
        await updateTimeLimitTokenUsed({
          model: inputModel,
          promptMessages: [lastMessage],
          completionMessage: lastAssistantMessage,
          aiModel: determineModel(inputModel),
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
  }, [inputModel, inputContext, setGenerating, setError, checkTokenUsage, updateTokenUsage, contextContent, inputType, outputType, models, countTotalTokens, determineModel, limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed, setChatConversation, updateModel, generating]);

  const handleStop = () => {
    setGenerating(false);
  };

  return { handleSubmit, handleStop, error };
};


