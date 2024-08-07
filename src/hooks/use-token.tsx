"use client";

import React, { useCallback, useMemo } from "react";
import { useDocumentStore } from "@/stores/features/apps/document/store";
import { useModelStore } from "@/stores/features/models/store";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useGeneralContext } from "@/context/general-context-provider";
import { TotalTokenUsed, TimeLimitTokenUsed, Model } from "@/app/types/ai";
import { modelMaxToken } from '@/constants/ai';
import { toast } from "sonner";

const TIME_LIMIT = 60000;

const MIN_TOKEN_THRESHOLD = 50;

export const useToken = () => {
  const chatModel = useDocumentStore((state) => state.chatModel);
  const inputModel = useModelStore((state) => state.inputModel);
  const AIConfig = useModelStore((state) => state.AIConfig);
  const setAIConfig = useModelStore((state) => state.setAIConfig);
  const tokenShortage = useModelStore((state) => state.tokenShortage);
  const setTokenShortage = useModelStore((state) => state.setTokenShortage);
  const autoAdjustToken = useModelStore((state) => state.autoAdjustToken);
  const updateModel = useMutation(api.models.updateModel);
  const models = useQuery(api.models.getAllModels);
  const { setShowWarning, setWarningType, isSystemModel } = useGeneralContext();

  const modelToUse = useMemo(() => {
    return isSystemModel ? inputModel : chatModel;
  }, [inputModel, isSystemModel, chatModel]);

  const inputModelData = useMemo(() => {
    const modelToFind = isSystemModel ? inputModel : chatModel;
    return models?.find(model => model.model === modelToFind);
  }, [models, inputModel, isSystemModel, chatModel]);

  const checkTokenUsage = useCallback(() => {
    if (!inputModelData) {
      console.error("Input model data not found");
      return true; 
    }
    const setTimeLimitTokenUsed = useModelStore.getState().setTimeLimitTokenUsed;
    const timeLimitTokenUsed: TimeLimitTokenUsed = JSON.parse(
      JSON.stringify(useModelStore.getState().timeLimitTokenUsed)
    );
    const { tokenLimit } = timeLimitTokenUsed[modelToUse];
    const { floor_inputTokens, floor_outputTokens, max_inputTokens, max_outputTokens } = inputModelData;
    const minTokens = Math.min(floor_inputTokens, floor_outputTokens, max_inputTokens, max_outputTokens);
    const isTokenLow = tokenLimit === 0 && minTokens < MIN_TOKEN_THRESHOLD;
    const isInsufficientTokens = !autoAdjustToken && 
      Math.max(floor_outputTokens, floor_inputTokens) + inputModelData.base_TPM < inputModelData.max_tokens;
    if (isTokenLow || isInsufficientTokens) {
      toast.error("Insufficient tokens available");
      setShowWarning(true);
      setWarningType(isTokenLow ? "REMINDER" : "SHORTAGE");
      setTokenShortage(true);
    } else {
      setShowWarning(false);
      setTokenShortage(false);
    }
    return isInsufficientTokens;
  }, [inputModelData, modelToUse, setShowWarning, setWarningType, setTokenShortage, autoAdjustToken]);
  
  const manageTokenUsage = useCallback((
    currentUsage: TimeLimitTokenUsed,
    tokenLimit: number,
    isTokenExceeded: boolean,
    remainingTokens: number,
  ): TimeLimitTokenUsed => {
    const now = Date.now();
    if (!inputModelData) return currentUsage;
    if ((now - currentUsage.lastTokenUpdateTime) > TIME_LIMIT) {
      return {
        inputTokens: [],
        outputTokens: [],
        totalInputTokens: currentUsage.totalInputTokens,
        totalOutputTokens: currentUsage.totalOutputTokens,
        lastTokenUpdateTime: now,
        isTokenExceeded: false,
        remainingTokens: inputModelData.base_TPM,
        tokenLimit: inputModelData.base_TPM / 2 + Math.max(inputModelData.floor_inputTokens, inputModelData.floor_outputTokens),
      };
    }
    return {
      ...currentUsage,
      tokenLimit,
      isTokenExceeded,
      remainingTokens,
    };
  }, [inputModelData]);

  const updateTokenUsage = useCallback(async () => {
    if (!inputModelData) return;
    const setTimeLimitTokenUsed = useModelStore.getState().setTimeLimitTokenUsed;
    const timeLimitTokenUsed: TimeLimitTokenUsed = JSON.parse(
      JSON.stringify(useModelStore.getState().timeLimitTokenUsed)
    );
    const totalTokenUsed: TotalTokenUsed = JSON.parse(
      JSON.stringify(useModelStore.getState().totalTokenUsed)
    );
    const currentUsage = timeLimitTokenUsed[modelToUse];
    const lastInputTokens = currentUsage.inputTokens[currentUsage.inputTokens.length - 1] || 0;
    const lastOutputTokens = currentUsage.outputTokens[currentUsage.outputTokens.length - 1] || 0;
    const totalTimeLimitUsedTokens = lastInputTokens + lastOutputTokens;
    let tokenLimit = currentUsage.tokenLimit;
    let remainingTokens = currentUsage.remainingTokens;
    let isTokenExceeded = currentUsage.isTokenExceeded;
    if (totalTimeLimitUsedTokens >= remainingTokens) {
      tokenLimit -= totalTimeLimitUsedTokens;
      const exceedValue = isTokenExceeded ? totalTimeLimitUsedTokens : totalTimeLimitUsedTokens - inputModelData.base_TPM;
      const excessInputTokens = (exceedValue / (inputModelData.max_inputTokens + inputModelData.max_outputTokens)) * inputModelData.max_inputTokens;
      const excessOutputTokens = (exceedValue / (inputModelData.max_inputTokens + inputModelData.max_outputTokens)) * inputModelData.max_outputTokens;
      inputModelData.max_outputTokens -= excessOutputTokens;
      inputModelData.max_inputTokens -= excessInputTokens;
      remainingTokens = 0;
      isTokenExceeded = true;
    } else {
      tokenLimit -= totalTimeLimitUsedTokens;
      remainingTokens -= totalTimeLimitUsedTokens;
    }
    const updatedUsage = manageTokenUsage(currentUsage, tokenLimit, isTokenExceeded, remainingTokens);
    const updatedModelData: Partial<Model> = {
      ...inputModelData,
      max_inputTokens: inputModelData.max_inputTokens,
      ceiling_inputTokens: Math.min(inputModelData.ceiling_inputTokens, inputModelData.max_inputTokens),
      floor_inputTokens: Math.min(inputModelData.floor_inputTokens, inputModelData.ceiling_inputTokens),
      max_outputTokens: inputModelData.max_outputTokens,
      ceiling_outputTokens: Math.min(inputModelData.ceiling_outputTokens, inputModelData.max_outputTokens),
      floor_outputTokens: Math.min(inputModelData.floor_outputTokens, inputModelData.ceiling_outputTokens),
      max_RPM: inputModelData.max_inputTokens / inputModelData.max_tokens,
      timeLimitTokenUsed: updatedUsage,
      totalTokenUsed: totalTokenUsed[modelToUse],
      max_tokens: autoAdjustToken ? Math.min(
        (modelMaxToken[inputModelData.model] || 4096),
        tokenLimit
      ) : inputModelData.max_tokens,
    };
    await updateModel({ id: inputModelData.cloudModelId, data: updatedModelData });
    setTimeLimitTokenUsed({ ...timeLimitTokenUsed, [modelToUse]: updatedUsage });
    setAIConfig({ ...AIConfig, [modelToUse]: { ...AIConfig[modelToUse], max_tokens: updatedModelData.max_tokens }});
  }, [inputModelData, modelToUse, AIConfig, setAIConfig, updateModel, manageTokenUsage, autoAdjustToken]);

  return { checkTokenUsage, updateTokenUsage };
};


