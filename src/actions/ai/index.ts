"use server";
import { client } from '@/lib/prisma';
import { ModelOption, NormalizedModelOption } from '@/types/ai';
import { PLAN_TYPE } from '@/types/app';

export interface PlanModelData {
  plan: PLAN_TYPE[];
}

export interface PlanAIModelData {
  name: ModelOption;
  modelId: string;
  version: string;
  updatedDate: string;  // Changed to string for Zod validation
  description?: string;
  maxRPM: number;     // max requests per minute
  ceilingRPM: number; // ceiling requests per minute
  floorRPM: number;   // floor requests per minute
  maxRPD: number;     // max requests per day
  ceilingRPD: number; // ceiling requests per day
  floorRPD: number;   // floor requests per day
  maxTPM: number;     // max tokens per minute
  ceilingTPM: number; // ceiling tokens per minute
  floorTPM: number;   // floor tokens per minute
  maxTPD: number;     // max tokens per day
  ceilingTPD: number; // ceiling tokens per day
  floorTPD: number;   // floor tokens per day
  purchasedAmount: number;
}

export interface CreditModelData {
  name: ModelOption;
  modelId: string;
  version: string;
  updatedDate: string;  // Changed to string for Zod validation
  description?: string;
  maxRPM: number;     // max requests per minute
  ceilingRPM: number; // ceiling requests per minute
  floorRPM: number;   // floor requests per minute
  maxRPD: number;     // max requests per day
  ceilingRPD: number; // ceiling requests per day
  floorRPD: number;   // floor requests per day
  maxInputTokens: number;     // max tokens per minute
  ceilingInputTokens: number;   // floor tokens per minute
  floorInputTokens: number; // ceiling tokens per minute
  maxOutputTokens: number;     // max tokens per day
  ceilingOutputTokens: number;   // floor tokens per day
  floorOutputTokens: number; // ceiling tokens per day
  purchasedAmount: number;
}

export async function registerPlanModel(planData: PlanModelData) {
  try {
    const createdPlanModel = await client.planModel.create({
      data: {
        plan: planData,
      },
    });
    return createdPlanModel.id;
  } catch (error) {
    console.error('Error registering model plan:', error);
    return null;
  }
}

export async function registerPlanAImodel(newPlanAIModelData: PlanAIModelData) {
  try {
    const createdPlanAImodel = await client.planAIModel.create({
      data: newPlanAIModelData,
    });
    return createdPlanAImodel.id;
  } catch (error) {
    console.error('Error registering model:', error);
    return null;
  }
}

export async function registerCreditModel(newCreditModelData: CreditModelData) {
  try {
    const createdCreditAIModel = await client.creditAIModel.create({
      data: newCreditModelData,
    });
    return createdCreditAIModel.id;
  } catch (error) {
    console.error('Error registering model:', error);
    return null;
  }
}

export async function changePlanModel(id: string, data: PlanModelData) {
  try {
    if (!id) {
      throw new Error('Model ID is required for updating.');
    }

    const model = await client.planModel.findUnique({
      where: { id },
    });

    if (!model) {
      throw new Error(`Model with ID ${id} not found.`);
    }

    const updatedModel = await client.planModel.update({
      where: { id },
      data,
    });

    return updatedModel;
  } catch (error) {
    console.error('Error updating model:', error);
    throw error;
  }
}

export async function changePlanAIModel(id: string, data: PlanAIModelData) {
  try {
    if (!id) {
      throw new Error('Model ID is required for updating.');
    }

    const model = await client.planAIModel.findUnique({
      where: { id },
    });

    if (!model) {
      throw new Error(`Model with ID ${id} not found.`);
    }

    const updatedModel = await client.planAIModel.update({
      where: { id },
      data,
    });

    return updatedModel;
  } catch (error) {
    console.error('Error updating model:', error);
    throw error;
  }
}

export async function changeCreditModel(id: string, data: CreditModelData) {
  try {
    if (!id) {
      throw new Error('Model ID is required for updating.');
    }

    const model = await client.creditAIModel.findUnique({
      where: { id },
    });

    if (!model) {
      throw new Error(`Model with ID ${id} not found.`);
    }

    const updatedModel = await client.creditAIModel.update({
      where: { id },
      data,
    });

    return updatedModel;
  } catch (error) {
    console.error('Error updating model:', error);
    throw error;
  }
}

export async function getPlanModels(): Promise<PlanModelData[]> {
  try {
    const models = await client.planModel.findMany();
    return models;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

export async function getCreditModels(): Promise<CreditModelData[]> {
  try {
    const models = await client.creditAIModel.findMany();
    return models;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

export async function getPlanAIModels(): Promise<PlanAIModelData[]> {
  try {
    const models = await client.planAIModel.findMany();
    return models;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

export async function getPlanAIModelById(modelId: string): Promise<PlanAIModelData> {
  try {
    const model = await client.planAIModel.findUnique({
      where: { id: modelId },
    });

    if (!model) {
      throw new Error(`Model with ID ${modelId} not found.`);
    }

    return model;
  } catch (error) {
    console.error('Error fetching model by ID:', error);
    return null;
  }
}

export async function getPlanAIModelIdByName(modelName: NormalizedModelOption): Promise<string | null> {
  try {
    const model = await client.planAIModel.findFirst({
      where: {
        name: modelName,
      },
    });

    if (!model) {
      console.warn(`Model with name ${modelName} not found.`);
      return null;
    }
    return model.id;
  } catch (error) {
    console.error('Error fetching model by name:', error);
    return null;
  }
}

export async function getPlanModelIdByPlan(plan: PLAN_TYPE): Promise<string | null> {
  try {
    const model = await client.planModel.findFirst({
      where: {
        plan: plan,
      },
    });

    if (!model) {
      console.warn(`Model with plan ${plan} not found.`);
      return null;
    }

    return model.id;
  } catch (error) {
    console.error('Error fetching model by plan:', error);
    return null;
  }
}

export async function getPlanAIModelsByPlan(plan: PLAN_TYPE): Promise<PlanAIModelData[] | null> {
  try {
    const model = await client.planModel.findFirst({
      where: {
        plan: plan,
      },
    });

    if (!model) {
      console.warn(`Model with plan ${plan} not found.`);
      return null;
    }

    const models = await client.planAIModel.findMany({
      where: {
        modelId: model.id,
      },
    });

    if (!models || models.length === 0) {
      console.warn(`No planAImodels found for model with id ${model.id}.`);
      return null;
    }

    return models;
  } catch (error) {
    console.error('Error fetching planAImodels by plan:', error);
    return null;
  }
}

