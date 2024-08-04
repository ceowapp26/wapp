import React, { useState } from "react";
import { useStore } from "@/redux/features/apps/document/store";
import { useTranslation } from "react-i18next";
import { MessageInterface, ModelOption, WarningType } from "@/types/chat";
import { limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed } from '@/utils/aiUtils';
import { useGeneralContext } from "@/context/general-context-provider";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
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

const determineAPIEndpoint = (option: string) => {
  const isGemini = option.includes("describe") || option.includes("extract");
  if (isGemini) {
    return { APIEndpoint: "/api/image_gemini", model: 'gemini' };
  } else {
    return { APIEndpoint: "/api/image_openai", model: 'openAI' };
  }
};

interface AIImageProps {
  option?: string;
  prompt?: string;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setWarningType?: React.Dispatch<React.SetStateAction<WarningType>>;
  setShowWarning?: React.Dispatch<React.SetStateAction<boolean>>;
  setNextTimeUsage?: React.Dispatch<React.SetStateAction<string>>;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  setResData?: React.Dispatch<React.SetStateAction<string>>;
}

export const useAIImage = ({
  option,
  prompt,
  setIsLoading,
  setShowWarning,
  setWarningType,
  setNextTimeUsage,
  setError,
  setResData,
}: AIImageProps = {}) => {
  const { t } = useTranslation('api');
  const [outputMessage, setOutputMessage] = useState<string>("");
  const AIConfig = useStore((state) => state.AIConfig);
  const countTotalTokens = useStore((state) => state.countTotalTokens);
  const inputModel = useStore((state) => state.inputModel);
  const inputContext = useStore((state) => state.inputContext);
  const { aiModel, inputType, outputType } = useGeneralContext();
  const { checkTokenUsage, updateTokenUsage } = useToken();
  const updateModel = useMutation(api.models.updateModel);
  const models = useQuery(api.models.getAllModels);

  const updateTokens = async (promptMessage: MessageInterface, completionMessage: MessageInterface, inputModelData: any, imageInput?: any) => {
    await Promise.all([
      updateTotalTokenUsed({
        model: inputModel,
        promptMessages: [promptMessage],
        completionMessage,
        aiModel,
        inputType,
        outputType,
        inputImage: imageInput,
        inputModelData,
        updateModel,
      }),
      updateTimeLimitTokenUsed({
        model: inputModel,
        promptMessages: [promptMessage],
        completionMessage,
        aiModel,
        inputType, 
        outputType,
        inputImage: imageInput,
        inputModelData,
        updateModel,
      }),
      updateTokenUsage(),
    ]);
  };

  const handleAIImage = async () => {
    setIsLoading && setIsLoading(true);
    const inputModelData = models?.find(model => model.model === inputModel);
    if (!inputModelData) {
      console.error("Input model data not found");
      return; 
    }
    const { APIEndpoint, model } = determineAPIEndpoint(option);
    let requestOption = {
      prompt: prompt,
      command: option,
      model: inputModel,
      contextContent: '',
      config: {
        RPM: inputModelData.base_RPM + inputModelData.floor_RPM,
        RPD: inputModelData.base_RPD + inputModelData.floor_RPD,
        max_tokens: inputModelData.max_tokens,
      }
    };
    try {
      const isInsufficientTokens = checkTokenUsage();

      if (isInsufficientTokens) return; 

      const fetchAPI = async () => {

        const response = await fetch(APIEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestOption),
        });

        if (!response.ok) {
          if (response.status === 429 || response.status === 403) {
            const data = await response.json();
            setShowWarning?.(true);
            if (response.status === 429) {
              setWarningType?.('CURRENT');
              setNextTimeUsage?.(data.nextAllowedTime);
            } else if (response.status === 403 && data.error.includes('Country, region, or territory not supported')) {
              setWarningType?.('UNSUPPORTED');
            }
            setError?.(data.error);
            return;
          }
          throw new Error(await response.text());
        }

        const result = await response.json();

        return result;
      };

      if (model === "openAI") {      
        const promptMessage: MessageInterface = convertToMessageInterface("user", "", prompt, inputContext, inputModel);
        const messages = limitMessageTokens([promptMessage], AIConfig[inputModel].max_tokens, inputModel, aiModel, inputType, outputType);
        if (messages.length === 0) {
          toast.error("Message exceeds max token!");
          throw new Error('Message exceeds max token!');
          return;
        }
        const result = await fetchAPI();
        setResData && setResData(result.response);
        if (countTotalTokens) {
          const completionMessage = convertToMessageInterface("assistant", "", result.response, inputContext, inputModel);
          await updateTokens(promptMessage, completionMessage, inputModelData);
        }
       
      } else if (model === "gemini") {
        const result = await fetchAPI();
        const { textInput, imageInput, response } = result;
        setResData && setResData(response);
      if (countTotalTokens) {
          const promptMessage = convertToMessageInterface("user", "", textInput, inputContext, inputModel);
          const completionMessage = convertToMessageInterface("assistant", "", response, inputContext, inputModel);
          await updateTokens(promptMessage, completionMessage, inputModelData, imageInput);
        }
      }
    } catch (e: unknown) {
      const err = (e as Error).message;
      if (err.includes('Country, region, or territory not supported')) {
        setError?.('Your region is not supported. Please try again later or contact support.');
      } else if (err.includes('You have reached your request limit for the day.')) {
        setError?.('You have reached your request limit for the day.');
      } else if (err.includes('You have reached your request limit for the minute.')) {
        setError?.('You have reached your request limit for the minute.');
      } else {
        setError?.(err);
      }
    } finally {
      setIsLoading && setIsLoading(false);
    }
  };

  return { handleAIImage }; 
};
