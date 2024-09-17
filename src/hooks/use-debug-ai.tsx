import React, { useCallback, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { useCompletion } from "ai/react";
import { limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed, determineModel } from '@/utils/aiUtils';
import { useToken } from './use-token';
import { useModelStore } from '@/stores/features/models/store';
import { useGeneralContext } from '@/context/general-context-provider';
import { MessageInterface } from '@/types/chat';
import { debugAPIEndpointOptions } from '@/constants/ai';
import { getAPIEndpoint } from '@/utils/aiUtils';

const convertToMessageInterface = (
  role: string,
  command: string,
  content: string,
  context: Context,
  model: ModelOption
): MessageInterface => ({
  role,
  command,
  content,
  context,
  model,
});

interface useDebugAIProps {
  setDebuggingErrors: React.Dispatch<React.SetStateAction<{ [line: string]: string }>>;
  findLineNumber: (lineContent: string) => number;
  setCurrentLine: React.Dispatch<React.SetStateAction<number>>;
  scrollToLine: (line: number) => void;
  generating: boolean;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useDebugAI = ({
  generating,
  setGenerating,
  error,
  setError,
  setDebuggingErrors,
  findLineNumber,
  setCurrentLine,
  scrollToLine,
}: useDebugAIProps) => {
  const inputModel = useModelStore((state) => state.inputModel);
  const inputContext = useModelStore((state) => state.inputContext);
  const countTotalTokens = useModelStore((state) => state.countTotalTokens);
  const { inputType, outputType, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
  const { checkTokenUsage, updateTokenUsage } = useToken();
  const updateModel = useMutation(api.models.updateModel);
  const models = useQuery(api.models.getAllModels);
  const promptMessageRef = useRef<MessageInterface | null>(null);
  const outputMessageRef = useRef<any>(null);
  const claude_input_tokens = useRef(0);
  const claude_output_tokens = useRef(0);

  const { complete, stop } = useCompletion({
    api: getAPIEndpoint(debugAPIEndpointOptions, inputModel),
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
    onError: (e) => {
      setError(e.message);
      toast.error(e.message);
    },
    onFinish: (prompt, completion) => {
      outputMessageRef.current = completion;
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

  const handleDebug = useCallback(async (prompt: string, command: string) => {
    if (generating || !inputContext || !inputModel) {
      console.warn("Chat context or model is missing, or generating is true.");
      return;
    }
    const inputModelData = models?.find((model) => model.model === inputModel);
    if (!inputModelData) {
      console.error('Input model data not found');
      return; 
    }
    setGenerating(true);
    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;
      const _promptMessage: MessageInterface = convertToMessageInterface("user", command, prompt, inputContext, inputModel);
      promptMessageRef.current = _promptMessage;
      const messages = await limitMessageTokens([_promptMessage], inputModelData.max_tokens, inputModel, determineModel(inputModel), inputType, outputType);
      if (messages.length === 0) {
        toast.error('Message exceeds max token!');
        return;
      }
      const requestOption = {
        command: command,
        model: inputModel,
        config: {
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        },
      };
      const data = await complete(prompt, { body: requestOption });
      if (data) {
        setDebuggingErrors(JSON.parse(data));
        const firstErrorLine = Object.keys(JSON.parse(data))[0];
                console.log("this is data", Object.keys(JSON.parse(data))[0])

        if (firstErrorLine) {
          const lineNumber = findLineNumber(firstErrorLine);
                          console.log("this is lineNumber", lineNumber)

          if (lineNumber !== -1) {
            setCurrentLine(lineNumber);
            scrollToLine(lineNumber);
          }
        }
        if (determineModel(inputModel) === "claude") {
          claude_input_tokens.current = data.usage.input_tokens;
          claude_output_tokens.current = data.usage.output_tokens;
        }
        return data;
      }
    } catch (e: unknown) {
      console.error("Error in POST request:", (e as Error).message);
      return;      
    } finally {
      setGenerating(false);
      if (countTotalTokens && promptMessageRef.current && outputMessageRef.current) {
        const completionMessage: MessageInterface = convertToMessageInterface("assistant", "", outputMessageRef.current, inputContext, inputModel);
        await updateTotalTokenUsed({
          model: inputModel,
          promptMessages: [promptMessageRef.current],
          completionMessage: completionMessage,
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
          promptMessages: [promptMessageRef.current],
          completionMessage: completionMessage,
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
  }, [inputModel, inputContext, setGenerating, setError, checkTokenUsage, updateTokenUsage, inputType, outputType, models, countTotalTokens, determineModel, limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed, promptMessageRef, outputMessageRef, findLineNumber, setCurrentLine, scrollToLine]);

  const handleStopDebug = () => {
    setGenerating(false);
  };

  return { handleDebug, handleStopDebug, error };
};

