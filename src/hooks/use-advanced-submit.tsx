"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useModelStore } from "@/stores/features/models/store";
import { useSubmit } from "@/hooks/use-submit";
import { ChatInterface, MessageInterface } from "@/types/chat";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed, determineModel } from '@/utils/aiUtils';
import { useGeneralContext } from "@/context/general-context-provider";
import { ModelOption, WarningType } from "@/app/types/ai";
import { defaultAdvancedAPIEndPoint, advancedAPIEndpointOptions } from "@/constants/ai";
import { useCompletion } from "ai/react";
import { useToken } from "./use-token";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

export type Context = "general" | "selection" | "page" | "q&a";

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

interface AdvancedAIProps {
  option?: string; 
  prompt?: string;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowWarning?: React.Dispatch<React.SetStateAction<boolean>>; 
  setWarningType?: React.Dispatch<React.SetStateAction<WarningType>>;
  setNextTimeUsage?: React.Dispatch<React.SetStateAction<string>>;
  setResData?: React.Dispatch<React.SetStateAction<any>>;
  setError?: React.Dispatch<React.SetStateAction<string>>;
}

export const useAdvancedSubmit = ({
  option,
  prompt,
  setIsLoading,
  setShowWarning,
  setWarningType,
  setNextTimeUsage,
  setError,
  setResData,
}: AdvancedAIProps = {}) => { 
  const { t, i18n } = useTranslation('api');
  const [promptMessage, setPromptMessage] = useState<MessageInterface | null>(null);
  const [outputMessage, setOutputMessage] = useState<string>("");
  const inputModel = useModelStore((state) => state.inputModel);
  const inputContext = useModelStore((state) => state.inputContext);
  const AIConfig = useModelStore((state) => state.AIConfig);
  const countTotalTokens = useModelStore((state) => state.countTotalTokens);
  const setApiEndpoint = useModelStore((state) => state.setApiEndpoint);
  const { aiModel, inputType, outputType } = useGeneralContext();
  const { checkTokenUsage, updateTokenUsage } = useToken();
  const updateModel = useMutation(api.models.updateModel);
  const models = useQuery(api.models.getAllModels);

  const apiEndpoint = useMemo(() => {
    const model = determineModel(inputModel);
    const endpoint = advancedAPIEndpointOptions.find(option => option.key === model)?.value;
    setApiEndpoint(endpoint);
    return endpoint;
  }, [inputModel, setApiEndpoint, advancedAPIEndpointOptions]);

  const { complete } = useCompletion({
    api: apiEndpoint,
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
      setResData && setResData(completion);
      setOutputMessage(completion);
    },
  });

  const handlAdvancedSubmit = async () => {
    setIsLoading && setIsLoading(true);
    const inputModelData = models?.find(model => model.model === inputModel);
    if (!inputModelData) {
      console.error("Input model data not found");
      return; 
    }
    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;
      const promptMessage: MessageInterface = convertToMessageInterface("user", "", prompt, inputContext, inputModel);
      const messages = limitMessageTokens([promptMessage], AIConfig[inputModel].max_tokens, inputModel, aiModel, inputType, outputType);
      if (messages.length === 0) {
        toast.error("Message exceeds max token!");
        throw new Error('Message exceeds max token!');
        return;
      }
      let requestOption = {
        command: option,
        model: inputModel,
        contextContent: '',
        config: {
          RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
          RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
          max_tokens: inputModelData.max_tokens,
        }
      };
      await complete(prompt, { body: requestOption });
    } catch (e: unknown) {
      const err = (e as Error).message;
      console.error("Error in POST request:", err);
    } finally {
      setIsLoading && setIsLoading(false);
      if (countTotalTokens && promptMessage && outputMessage) {
        const completionMessage: MessageInterface = convertToMessageInterface("assistant", "", outputMessage, inputContext, inputModel);
        await Promise.all([
          updateTotalTokenUsed({
            model: inputModel,
            promptMessages: [promptMessage],
            completionMessage: completionMessage,
            aiModel: aiModel,
            inputType: inputType, 
            outputType: outputType,
            inputModelData: inputModelData,
            updateModel: updateModel,
          }),
          updateTimeLimitTokenUsed({
            model: inputModel,
            promptMessages: [promptMessage],
            completionMessage: completionMessage,
            aiModel: aiModel,
            inputType: inputType, 
            outputType: outputType,
            inputModelData: inputModelData,
            updateModel: updateModel,
          }),
          updateTokenUsage(),
        ]);
      }
    }
  };
  return { handlAdvancedSubmit };
};


