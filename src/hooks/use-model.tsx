import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  PlanAIModelData,
  PlanModelData,
  CreditModelData,
  registerPlanModel,
  registerCreditModel,
  registerPlanAImodel,
  changePlanAIModel,
  changePlanModel,
  changeCreditModel,
  getPlanAIModels,
  getPlanAIModelsByPlan,
  getPlanModels,
  getCreditModels,
  getPlanAIModelIdByName,
  getPlanModelIdByPlan,
} from '@/actions/ai';
import { PlanModelFormProps, PlanModelSchema, CreditModelFormProps, CreditModelSchema } from '@/schemas/model.schema';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useStore } from '@/redux/features/apps/document/store';
import { CloudModelConfigInterface, CloudModelConfigCollectionInterface, LocalModelConfigInterface } from "@/types/ai";
import { useModelContextHook } from '@/context/model-context-provider';
import { calculateFloorMAR } from '@/utils/APILimitUtils';
import { PLAN_TYPE } from '@/types/app';
import { useRouter } from 'next/navigation';

export const useModel = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const createModel = useMutation(api.models.createModel);
  const allUsers = useQuery(api.users.getAllUsers);
  const currentUser = useQuery(api.users.getCurrentUser);
  const router = useRouter();
  const [userPlan, setUserPlan] = useState<PLAN_TYPE>('FREE');
  const setAIConfig = useStore((state) => state.setAIConfig);
  const AIConfig = useStore((state) => state.AIConfig);
  const { modelType, planType, aiModelStatus, setAiModelStatus, planModelStatus, setPlanModelStatus, setCurrentStep } = useModelContextHook();

  useEffect(() => {
    if (allUsers) setTotalUsers(allUsers.length);
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) setUserPlan(currentUser?.subscriptionInfo?.plan || 'FREE');
  }, [currentUser]);

  const handleCreateModel = async (data: CloudModelConfigInterface) => {
    try {
      await createModel({ data: data });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleAsyncAIModel = async (modelExists: boolean, localData: LocalModelConfigInterface, convexData: CloudModelConfigInterface, prismaData: PlanAIModelData | CreditModelData, prismaModelId: string | null) => {
    try {
      setAiModelStatus(modelExists ? 'UPDATE' : 'CREATE');
      if (!modelExists) {
        await handleCreateModel(convexData);
        modelType === "SUBSCRIPTION" ? await registerPlanAImodel(prismaData) : await registerCreditModel(prismaData);
      } else {
        if (!prismaModelId) throw new Error('Prisma Model ID not found');
        modelType === "SUBSCRIPTION" ? await changePlanAIModel(prismaModelId, prismaData) : await changeCreditModel(prismaModelId, prismaData);
      }
      const updatedConfigs = { ...AIConfig, [localData.model]: localData };
      setAIConfig(updatedConfigs);
      toast.success(modelExists ? 'Model updated successfully.' : 'Model registered successfully.');
    } catch (error) {
      toast.error(error?.message || 'An unexpected error occurred.');
      throw error;
    }
  };

  const handleAsyncPlanModel = async (planExists: boolean, planType: PlanModelData, modelId: string | null) => {
    try {
      setPlanModelStatus(planExists ? 'UPDATE' : 'CREATE');
      let newModelId: string;
      if (!planExists) {
        newModelId = await registerPlanModel(planType);
      } else {
        if (!modelId) throw new Error('Prisma Model ID not found');
        await changePlanModel(modelId, { plan: planType });
        newModelId = modelId;
      }
      toast.success(planExists ? 'Plan model updated successfully.' : 'Plan model registered successfully.');
      return newModelId;
    } catch (error) {
      toast.error(error?.message || 'An unexpected error occurred.');
      throw error;
    }
  };

  const onRegisterModelPlan = async (planType: PlanModelData, onNext: React.Dispatch<React.SetStateAction<number>>) => {
    try {
      const registeredPlanModels = await getPlanModels();
      const existingModel = registeredPlanModels.find(model => model.plan === planType);
      const modelId = existingModel ? await getPlanModelIdByPlan(planType) : null;
      const _modelId = await handleAsyncPlanModel(!!existingModel, planType, modelId);
      onNext((prev) => prev + 1);
      return _modelId;
    } catch (error) {
      toast.error('An unexpected error occurred.');
    }
  };

  const onReset = async () => {
    try {
      setCurrentStep(1);
      methods.reset();
      router.push('/admin/model');
    } catch (error) {
      toast.error(error?.message || 'An unexpected error occurred.');
      throw error;
    }
  };

  const schema = modelType === "SUBSCRIPTION" ? PlanModelSchema : CreditModelSchema;
  const methods = useForm<PlanModelFormProps | CreditModelFormProps>({
    resolver: zodResolver(schema),
    mode: 'all',
  });

  const onHandleSubmit = methods.handleSubmit(async (values) => {
    setLoading(true);
    try {
      const normalizedModel = values.name.replace(/[-.]/g, '_');
      let registeredPrismaModels;
      if (modelType === "SUBSCRIPTION") {
        if (!planType) throw new Error("Plan type is not defined");
        registeredPrismaModels = await getPlanAIModelsByPlan(planType);
      } else {
        registeredPrismaModels = await getCreditModels();
      }
      const existingModel = registeredPrismaModels && registeredPrismaModels.length > 0 
        ? registeredPrismaModels.find(model => model.name === normalizedModel && model.modelId === values.modelId) 
        : undefined;
      
      const prismaModelId = existingModel ? await getPlanAIModelIdByName(normalizedModel) : null;

      let initialLimits: CloudModelConfigCollectionInterface = {};
      if (userPlan === planType) {
        initialLimits = {
          model: values.name,
          base_RPM: calculateFloorMAR(values.floorRPM, totalUsers),
          base_RPD: calculateFloorMAR(values.floorRPD, totalUsers),
          base_TPM: calculateFloorMAR(values.floorTPM, totalUsers),
          base_TPD: calculateFloorMAR(values.floorTPD, totalUsers),
          max_RPM: calculateFloorMAR(values.floorRPM, totalUsers),
          ceiling_RPM: calculateFloorMAR(values.floorRPM, totalUsers),
          floor_RPM: calculateFloorMAR(values.floorRPM, totalUsers),
          max_RPD: calculateFloorMAR(values.floorRPD, totalUsers),
          ceiling_RPD: calculateFloorMAR(values.floorRPD, totalUsers),
          floor_RPD: calculateFloorMAR(values.floorRPD, totalUsers),
          max_inputTokens: 0,
          ceiling_inputTokens: 0,
          floor_inputTokens: 0,
          max_outputTokens: 0,
          ceiling_outputTokens: 0,
          floor_outputTokens: 0,
          max_tokens: calculateFloorMAR(values.floorTPM, totalUsers) / 2,
        };
      }
      const { model, base_RPM, base_RPD, base_TPM, base_TPD } = initialLimits;
      const localModelData: LocalModelConfigInterface = { model, base_RPM, base_RPD, base_TPM, base_TPD };
      const convexAIModelData: CloudModelConfigInterface = { ...initialLimits };
      const prismaAIModelData: PlanAIModelData | CreditModelData = {
        name: normalizedModel,
        modelId: values.modelId,
        version: values.version,
        updatedDate: new Date(values.updatedDate),
        description: values.description,
        maxRPM: values.maxRPM,
        floorRPM: values.floorRPM,
        ceilingRPM: values.ceilingRPM,
        maxRPD: values.maxRPD,
        floorRPD: values.floorRPD,
        ceilingRPD: values.ceilingRPD,
        purchasedAmount: values.purchasedAmount,
        ...(modelType === "CREDIT" ? {
          maxInputTokens: values.maxInputTokens,
          ceilingInputTokens: values.ceilingInputTokens,
          floorInputTokens: values.floorInputTokens,
          maxOutputTokens: values.maxOutputTokens,
          ceilingOutputTokens: values.ceilingOutputTokens,
          floorOutputTokens: values.floorOutputTokens,
        } : {
          maxTPM: values.maxTPM,
          floorTPM: values.floorTPM,
          ceilingTPM: values.ceilingTPM,
          maxTPD: values.maxTPD,
          floorTPD: values.floorTPD,
          ceilingTPD: values.ceilingTPD,
        })
      };

      await handleAsyncAIModel(!!existingModel, localModelData, convexAIModelData, prismaAIModelData, prismaModelId);
    } catch (error) {
      console.error("Error in onHandleSubmit:", error);
      toast.error(error?.message || 'An unexpected error occurred while submitting the model.');
    } finally {
      setLoading(false);
      await onReset();
    }
  });
  return {
    methods,
    onHandleSubmit,
    onRegisterModelPlan,
    loading,
  };
};
