"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { calculateFloorMAR } from '@/utils/APILimitUtils';
import { getPlanAIModelsByPlan } from '@/actions/ai';
import { useInAppNotification } from "@/hooks/use-inapp-notification";
import NotificationWrapper from "@/components/notifications/notification-wrapper";
import { generateDefaultTimeLimitTokenUsed } from "@/constants/ai";
import { modelMapping, NormalizedModelOption, ModelOption, CloudModelConfigInterface, TimeLimitTokenUsed } from "@/types/ai";
import { UserModelInfo } from "@/types/user";

const convertModelName = (normalizedModelName: NormalizedModelOption): ModelOption => modelMapping[normalizedModelName];

type AppProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppProps> = ({ children }) => {
  const [shouldSync, setShouldSync] = useState(true);
  const { isModalOpen, closeModal, notification } = useInAppNotification();
  const registeredConvexModels = useQuery(api.models.getAllModels);
  const createModel = useMutation(api.models.createModel);
  const updateModel = useMutation(api.models.updateModel);
  const allUsers = useQuery(api.users.getAllUsers);
  const currentUser = useQuery(api.users.getCurrentUser);
  const updateMultipleModelsInfo = useMutation(api.users.updateMultipleModelsInfo);
  const AIConfig = useStore((state) => state.AIConfig);
  const setAIConfig = useStore((state) => state.setAIConfig);
  const totalTokenUsed = useStore((state) => state.totalTokenUsed);
  const setTotalTokenUsed = useStore((state) => state.setTotalTokenUsed);
  const timeLimitTokenUsed = useStore((state) => state.timeLimitTokenUsed);
  const setTimeLimitTokenUsed = useStore((state) => state.setTimeLimitTokenUsed);
  
  const handleUpdateMultipleModelsInfo = useCallback(async (id: Id<"users">, data: UserModelInfo[]) => {
    try {
      await updateMultipleModelsInfo({ id: id, data: data });
    } catch (error) {
      console.error("Error updating model info:", error);
    }
  }, [updateMultipleModelsInfo]);

  const handleModelOperation = useCallback(async (operation: 'create' | 'update', data: Partial<CloudModelConfigInterface>, id?: Id<"models">) => {
    try {
      if (operation === 'create') {
        await createModel({ data: data as CloudModelConfigInterface });
      } else if (id) {
        await updateModel({ id: id, data: data });
      }
    } catch (error) {
      console.error(`Error ${operation}ing model:`, error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      throw error;
    }
  }, [createModel, updateModel]);

  const syncCloudModels = useCallback(async () => {
    if (!currentUser?.subscriptionInfo?.plan || !allUsers) return;
    const userCurrentPlan = currentUser.subscriptionInfo.plan;
    const registeredPrismaModels = await getPlanAIModelsByPlan(userCurrentPlan);
    if (!registeredPrismaModels) return;
    const totalUsers = allUsers.length;
    if (!registeredConvexModels || registeredConvexModels.length === 0) {
      for (const prismaModel of registeredPrismaModels) {
        const data = {
          model: convertModelName(prismaModel.name),
          base_RPM: calculateFloorMAR(prismaModel.floorRPM, totalUsers),
          base_RPD: calculateFloorMAR(prismaModel.floorRPD, totalUsers),
          base_TPM: calculateFloorMAR(prismaModel.floorTPM, totalUsers),
          base_TPD: calculateFloorMAR(prismaModel.floorTPD, totalUsers),
        };
        await handleModelOperation('create', data);
      }
      return; 
    }
    const convexModelMap = new Map(registeredConvexModels.map(model => [model.model, model]));
    for (const prismaModel of registeredPrismaModels) {
      const convexModel = convexModelMap.get(convertModelName(prismaModel.name));
      const newData = {
        model: convertModelName(prismaModel.name),
        base_RPM: calculateFloorMAR(prismaModel.floorRPM, totalUsers),
        base_RPD: calculateFloorMAR(prismaModel.floorRPD, totalUsers),
        base_TPM: calculateFloorMAR(prismaModel.floorTPM, totalUsers),
        base_TPD: calculateFloorMAR(prismaModel.floorTPD, totalUsers),
      };
      if (!convexModel) {
        await handleModelOperation('create', newData);
      } else {
        const hasChanges = Object.entries(newData).some(
          ([key, value]) => convexModel[key as keyof typeof convexModel] !== value
        );
        if (hasChanges) {
          const updatedData = { ...convexModel, ...newData };
          await handleModelOperation('update', updatedData, convexModel.cloudModelId);
        }
      }
    }
  }, [currentUser, registeredConvexModels, allUsers, handleModelOperation]);

  const syncUserModels = useCallback(async () => {
    if (!currentUser || !registeredConvexModels) return;
    let updatedModels: UserModelInfo[] = [];
    if (!currentUser.modelInfo || currentUser.modelInfo.length === 0) {
      updatedModels = registeredConvexModels.map(convexModel => ({
        model: convexModel.model,
        cloudModelId: convexModel.cloudModelId, 
        RPM: convexModel.base_RPM,
        RPD: convexModel.base_RPD,
        TPM: convexModel.base_TPM,
        TPD: convexModel.base_TPD,
      }));
    } else {
      const userModelMap = new Map(currentUser.modelInfo.map(model => [model.model, model]));
      updatedModels = registeredConvexModels.reduce((acc: UserModelInfo[], convexModel) => {
        const userModel = userModelMap.get(convexModel.model);
        if (!userModel || ['RPM', 'RPD', 'TPM', 'TPD'].some(key => convexModel[`base_${key}`] !== userModel[key])) {
          acc.push({
            model: convexModel.model,
            cloudModelId: convexModel.cloudModelId, 
            RPM: convexModel.base_RPM,
            RPD: convexModel.base_RPD,
            TPM: convexModel.base_TPM,
            TPD: convexModel.base_TPD,
          });
        }
        return acc;
      }, []);
    }

    if (updatedModels.length > 0) {
      await handleUpdateMultipleModelsInfo(currentUser._id, updatedModels);
    }
  }, [registeredConvexModels, currentUser, handleUpdateMultipleModelsInfo]);  

  const syncLocalModels = useCallback(async () => {
    if (!registeredConvexModels) return;
    const updatedAIConfig = { ...AIConfig };
    const updatedTimeLimitTokenUsed = { ...timeLimitTokenUsed };
    const updatedTotalTokenUsed = { ...totalTokenUsed };
    let hasChanges = false;

    for (const convexModel of registeredConvexModels) {
      const localAIConfig = updatedAIConfig[convexModel.model] || {};
      const configKeys = ['base_RPM', 'base_RPD', 'base_TPM', 'base_TPD', 'max_tokens'];
      if (configKeys.some(key => localAIConfig[key] !== convexModel[key])) {
        updatedAIConfig[convexModel.model] = {
          ...localAIConfig,
          model: convexModel.model,
          ...Object.fromEntries(configKeys.map(key => [key, convexModel[key]]))
        };
        hasChanges = true;
      }
      const localTimeLimitTokenUsed = updatedTimeLimitTokenUsed[convexModel.model];
      if (localTimeLimitTokenUsed !== convexModel.timeLimitTokenUsed) {
        updatedTimeLimitTokenUsed[convexModel.model] = convexModel.timeLimitTokenUsed;
        hasChanges = true;
      }
      const localTotalTokenUsed = updatedTotalTokenUsed[convexModel.model];
      if (localTotalTokenUsed !== convexModel.totalTokenUsed) {
        updatedTotalTokenUsed[convexModel.model] = convexModel.totalTokenUsed;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      setAIConfig(updatedAIConfig);
      setTimeLimitTokenUsed(updatedTimeLimitTokenUsed);
      setTotalTokenUsed(updatedTotalTokenUsed);
    }
  }, [registeredConvexModels, AIConfig, timeLimitTokenUsed, totalTokenUsed, setAIConfig, setTimeLimitTokenUsed, setTotalTokenUsed]);

  useEffect(() => {
    if (shouldSync && registeredConvexModels && currentUser && allUsers) {
      const syncAll = async () => {
        await syncCloudModels();
        await syncUserModels();
        await syncLocalModels();
        setShouldSync(false);
      };
      syncAll();
    }
  }, [shouldSync, registeredConvexModels, currentUser, allUsers]);

  useEffect(() => {
    setShouldSync(true);
  }, [registeredConvexModels, currentUser, allUsers, AIConfig, totalTokenUsed, timeLimitTokenUsed]);

  return (
    <React.Fragment>
      {notification && 
        <NotificationWrapper
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          type={notification.type}
          notification={notification}
        />
      }
      {children}
    </React.Fragment>
  );
}

export default AppLayout;






