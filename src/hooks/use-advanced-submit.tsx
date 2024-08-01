"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useStore } from "@/redux/features/apps/document/store";
import { useSubmit } from "@/hooks/use-submit";
import { ChatInterface, MessageInterface } from "@/types/chat";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed } from '@/utils/aiUtils';
import { useGeneralContext } from "@/context/general-context-provider";
import { ModelOption, WarningType } from "@/app/types/ai";
import { defaultAdvancedAPIEndPoint } from "@/constants/ai";
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
  const inputModel = useStore((state) => state.inputModel);
  const inputContext = useStore((state) => state.inputContext);
  const AIConfig = useStore((state) => state.AIConfig);
  const countTotalTokens = useStore((state) => state.countTotalTokens);
  const { aiModel, inputType, outputType } = useGeneralContext();
  const { checkTokenUsage, updateTokenUsage } = useToken();
  const updateModel = useMutation(api.models.updateModel);
  const models = useQuery(api.models.getAllModels);

  if (!defaultAdvancedAPIEndPoint || defaultAdvancedAPIEndPoint.length === 0) throw new Error(t('noApiKeyWarning') as string);
  const { complete } = useCompletion({
    api: defaultAdvancedAPIEndPoint,
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
      setError && setError(e.message);
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
      console.log(err);
      setError && setError(err);
    } finally {
      setIsLoading && setIsLoading(false);
      if (countTotalTokens && promptMessage && outputMessage) {
        const completionMessage: MessageInterface = convertToMessageInterface("assistant", "", outputMessage, inputContext, inputModel);
         updateTotalTokenUsed({
          model: inputModel,
          promptMessages: [promptMessage],
          completionMessage: completionMessage,
          aiModel: aiModel,
          inputType: inputType, 
          outputType: outputType,
          inputModelData: inputModelData,
          updateModel: updateModel,
        });
        await updateTimeLimitTokenUsed({
          model: inputModel,
          promptMessages: [promptMessage],
          completionMessage: completionMessage,
          aiModel: aiModel,
          inputType: inputType, 
          outputType: outputType,
          inputModelData: inputModelData,
          updateModel: updateModel,
        });
        await updateTokenUsage();
      }
    }
  };
  return { handlAdvancedSubmit };
};


