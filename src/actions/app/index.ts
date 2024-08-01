"use server";
import { client } from '@/lib/prisma'
import { PLAN_TYPE } from '@/types/app'

export interface AppData {
  name: string;
  version: string;
  category: string;
  plan: Plans; 
  deployedDate: Date;
  releasedDate: Date;
  description?: string;
  developers: {
    lead: string;
    team: string[];
  };
  releaseNotes: {
    version: string;
    date: Date;
    notes: string;
  }[];
  license?: string;
  platform: string;
  watermark?: string;
  domain: string;
  logo?: string;
}

export interface FeatureData {
  name: string;
  version: string;
  deployedDate: Date;
  releasedDate: Date;
  description?: string;
  developers: {
    lead: string;
    team: string[];
  };
  releaseNotes: {
    version: string;
    date: Date;
    notes: string;
  }[];
  appId: string; 
  serviceId?: string;
  plan: Plans; 
}

export async function registerApp(data: AppData) {
  try {
    const createdApp = await client.app.create({
      data: data,
    });
    return createdApp.id;
  } catch (error) {
    console.error('Error registering app:', error);
    return null;
  }
}

export async function updateApp(id: string, data: AppData) {
  try {
    const existingApp = await client.app.findUnique({
      where: { id },
    });

    if (!existingApp) {
      throw new Error(`App with ID ${id} not found.`);
    }

    const updatedApp = await client.app.update({
      where: { id },
      data,
    });

    return updatedApp;
  } catch (error) {
    console.error('Error updating app:', error);
    throw error;
  }
}

export async function getAppsByPlan(plan: PLAN_TYPE) {
  try {
    const apps = await client.app.findMany({
      where: {
        plan: plan,
      },
    });
    const publishedApps = await Promise.all(
      apps.map(async (app) => {
        const features = await getFeaturesByAppId(app.id);
        return {
          [`app${app.id}`]: {
            name: app.name,
            category: app.category,
            domain: app.domain,
            logo: app.logo,
            license: app.license,
            platform: app.platform,
            features,
          },
        };
      })
    );
    return publishedApps.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  } catch (error) {
    console.error('Error fetching apps:', error);
    return {}; 
  }
}

export async function getAllApps() {
  try {
    const apps = await client.app.findMany();
    return apps;
  } catch (error) {
    console.error('Error fetching apps:', error);
    return []; 
  }
}

export async function getAppIdByName(appName: string) {
  try {
    const app = await client.app.findFirst({
      where: {
        name: appName,
      },
    });
    return app.id;
  } catch (error) {
    console.error(`Error fetching features for appId ${appId}:`, error);
    return null; 
  }
}

export async function registerFeature(data: FeatureData) {
  try {
    const { appId, ...rest } = data;
    const app = await client.app.findUnique({
      where: {
        id: appId,
      },
    });
    if (!app) {
      throw new Error(`App with ID ${appId} not found.`);
    }
    const createdFeature = await client.feature.create({
      data: {
        ...rest,
        app: {
          connect: {
            id: appId,
          },
        },
      },
    });

    return createdFeature;
  } catch (error) {
    console.error('Error registering feature:', error);
    throw error; 
  }
}

export async function updateFeature(id:string, data: FeatureData) {
  try {
    const existingFeature = await client.feature.findUnique({
      where: { id },
    });
    if (!existingFeature) {
      throw new Error(`Feature with ID ${id} not found.`);
    }
    const updatedFeature = await client.feature.update({
      where: { id },
      data,
    });
    return updatedFeature;
  } catch (error) {
    console.error('Error updating feature:', error);
    throw error;
  }
}

export async function getFeaturesByAppId(appId: string) {
  try {
    const features = await client.feature.findMany({
      where: {
        appId: appId,
      },
    });
    return features;
  } catch (error) {
    console.error(`Error fetching features for appId ${appId}:`, error);
    return []; 
  }
}

export async function getFeatureIdByName(featureName: string) {
  try {
    const feature = await client.feature.findFirst({
      where: {
        name: featureName,
      },
    });
    return feature.id;
  } catch (error) {
    console.error(`Error fetching features for appId ${appId}:`, error);
    return null; 
  }
}

export async function getFeaturesByPlan(plan: PLAN_TYPE) {
  try {
    const features = await client.feature.findMany({
      where: {
        plan: plan,
      },
    });
    return features;
  } catch (error) {
    console.error(`Error fetching features for appId ${plan}:`, error);
    return []; 
  }
}

/*export async function getAppsByPlan(plan: PLAN_TYPE) {
  try {
    const apps = await client.app.findMany({
      where: {
        plan: plan,
      },
    });
    return apps;
  } catch (error) {
    console.error(`Error fetching features for appId ${plan}:`, error);
    return []; 
  }
}*/


