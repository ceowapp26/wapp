import React, { useCallback, useEffect, useState, useRef } from "react";
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
  const promptMessageRef = useRef();
  const outputMessageRef = useRef();
  const inputModel = useModelStore((state) => state.inputModel);
  const inputContext = useModelStore((state) => state.inputContext);
  const AIConfig = useModelStore((state) => state.AIConfig);
  const countTotalTokens = useModelStore((state) => state.countTotalTokens);
  const setApiEndpoint = useModelStore((state) => state.setApiEndpoint);
  const { inputType, outputType } = useGeneralContext();
  const { checkTokenUsage, updateTokenUsage } = useToken();
  const updateModel = useMutation(api.models.updateModel);
  const models = useQuery(api.models.getAllModels);
  
  const { complete } = useCompletion({
    api: useModelStore.getState().apiEndpoint,
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
      outputMessageRef.current = completion;
    },
  });

  const handlAdvancedSubmit = useCallback(async () => {
    setIsLoading && setIsLoading(true);
    const inputModelData = models?.find(model => model.model === inputModel);
    if (!inputModelData) {
      console.error("Input model data not found");
      return; 
    }
    try {
      const isInsufficientTokens = checkTokenUsage();
      if (isInsufficientTokens) return;
      const _promptMessage: MessageInterface = convertToMessageInterface("user", "", prompt, inputContext, inputModel);
      promptMessageRef.current = _promptMessage;
      const messages = await limitMessageTokens([_promptMessage], AIConfig[inputModel].max_tokens, inputModel, determineModel(inputModel), inputType, outputType);
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
        });
        await updateTokenUsage();
      }
    }
  }, [
    AIConfig, 
    checkTokenUsage, 
    complete, 
    countTotalTokens, 
    inputContext, 
    inputModel, 
    models, 
    option, 
    prompt,
    inputType, 
    outputType,  
    promptMessageRef, 
    outputMessageRef, 
    updateModel,
    limitMessageTokens,
    determineModel,
    convertToMessageInterface, 
    updateTimeLimitTokenUsed, 
    updateTokenUsage, 
    updateTotalTokenUsed,
    setIsLoading,
    setShowWarning,
    setWarningType,
    setNextTimeUsage,
    setResData,
    setError,
  ]);

  return { handlAdvancedSubmit };
};
