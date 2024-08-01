import React, { useState } from "react";
import { useStore } from "@/redux/features/apps/document/store";
import { useTranslation } from "react-i18next";
import { MessageInterface, ModelOption } from "@/types/chat";
import { limitMessageTokens, updateTotalTokenUsed, updateTimeLimitTokenUsed } from '@/utils/aiUtils';
import { useGeneralContext } from "@/context/general-context-provider";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
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
      const fetchAPI = async () => {
        const response = await fetch(APIEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestOption),
        });

        if (!response.ok) {
          if (response.status === 429) {
            const data = await response.json();
            setShowWarning && setShowWarning(true);
            setNextTimeUsage && setNextTimeUsage(data.nextAllowedTime);
            setWarningType && setWarningType("CURRENT");
            toast.error(data.error);
            return null; 
          }
          throw new Error('Failed to generate');
        }
        return await response.json();
      };

      if (model === "openAI") {
        const isInsufficientTokens = checkTokenUsage();
        if (isInsufficientTokens) return;        
        const promptMessage: MessageInterface = convertToMessageInterface("user", "", prompt, inputContext, inputModel);
        const messages = limitMessageTokens([promptMessage], AIConfig[inputModel].max_tokens, inputModel, aiModel, inputType, outputType);
        if (messages.length === 0) {
          toast.error("Message exceeds max token!");
          throw new Error('Message exceeds max token!');
          return;
        }
        const result = await fetchAPI();
        setResData && setResData(result.response);
        if (countTotalTokens && result) {
          const completionMessage: MessageInterface = convertToMessageInterface("assistant", "", result.response, inputContext, inputModel);
          await updateTotalTokenUsed({
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
      } else if (model === "gemini") {
        const result = await fetchAPI();
        const { textInput, imageInput, response } = result;
        setResData && setResData(response);
        const promptMessage: MessageInterface = convertToMessageInterface("user", "", textInput, inputContext, inputModel);
        if (countTotalTokens) {
          const completionMessage: MessageInterface = convertToMessageInterface("assistant", "", response, inputContext, inputModel);
          await updateTotalTokenUsed({
            model: inputModel,
            promptMessages: [promptMessage],
            completionMessage: completionMessage,
            aiModel: aiModel,
            inputType: inputType,
            outputType: outputType,
            inputImage: imageInput,
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
            inputImage: imageInput,
            inputModelData: inputModelData,
            updateModel: updateModel,
          });
          await updateTokenUsage();
        }
      }
    } catch (e: unknown) {
      const err = (e as Error).message;
      setError && setError(err);
    } finally {
      setIsLoading && setIsLoading(false);
    }
  };

  return { handleAIImage }; 
};

