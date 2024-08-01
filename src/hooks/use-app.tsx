import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAppContextHook } from '@/context/app-context-provider';
import { FeatureFormProps, FeatureSchema, AppFormProps, AppSchema } from '@/schemas/app.schema';
import {
  AppData,
  FeatureData,
  registerApp,
  updateApp,
  registerFeature,
  updateFeature,
  getAllApps,
  getAppIdByName,
  getFeaturesByAppId,
  getFeatureIdByName
} from '@/actions/app';

export const useApp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { appStatus, setAppStatus, featureStatus, setFeatureStatus, setCurrentStep } = useAppContextHook();
  const router = useRouter();
  const methods = useForm<FeatureFormProps>({
    resolver: zodResolver(FeatureSchema),
    mode: 'all',
  });

  const handleRegisterApp = async (appExists: boolean, data: AppData, appId: string | null) => {
    try {
      setAppStatus(appExists ? 'UPDATE' : 'CREATE');
      let newAppId: string;
      if (!appExists) {
        newAppId = await registerApp(data);
      } else {
        if (!appId) throw new Error('Prisma Model ID not found');
        await updateApp(appId, data);
        newAppId = appId;
      }
      toast.success(appExists ? 'App updated successfully.' : 'App registered successfully.');
      return newAppId;
    } catch (error) {
      toast.error(error?.message || 'An unexpected error occurred.');
      throw error;
    }
  };

  const handleRegisterFeature = async (featureExists: boolean, data: FeatureData, featureId: string | null) => {
    try {
      setFeatureStatus(featureExists ? 'UPDATE' : 'CREATE');
      let newFeatureId: string;
      if (!featureExists) {
        newFeatureId = await registerFeature(data);
      } else {
        if (!featureId) throw new Error('Prisma Model ID not found');
        await updateFeature(featureId, data);
        newFeatureId = featureId;
      }
      toast.success(featureExists ? 'Feature updated successfully.' : 'Feature registered successfully.');
      return newFeatureId;
    } catch (error) {
      toast.error(error?.message || 'An unexpected error occurred.');
      throw error;
    }
  };

  const onRegisterApp = async (data: AppData, onNext: React.Dispatch<React.SetStateAction<number>>) => {
    try {
      const registeredApps = await getAllApps();
      let appId: string | null = null;
      let appExists = false;
      for (const app of registeredApps) {
        if (app.name === data.name) {
          appExists = true;
          appId = await getAppIdByName(app.name);
          break;
        }
      }
      const _appId = await handleRegisterApp(appExists, data, appId);
      onNext((prev) => prev + 1);
      return _appId;
    } catch (error) {
      toast.error('An unexpected error occurred.');
    }
  };
  
  const onReset = async () => {
    try {
      setCurrentStep(1);
      methods.reset();
      router.push('/admin/app')
    } catch (error) {
      toast.error(error?.message || 'An unexpected error occurred.');
      throw error;
    }
  };

  const onHandleSubmit = methods.handleSubmit(async (values: FeatureFormProps) => {
    try {
      setLoading(true);
      const registeredFeatures = await getFeaturesByAppId(values.appId);
      let featureId: string | null = null;
      let featureExists = false;
      for (const feature of registeredFeatures) {
        if (feature.name === values.name) {
          featureExists = true;
          featureId = await getFeatureIdByName(values.name);
          break;
        }
      }
      const appFeature: FeatureData = {
        appId: values.appId,
        name: values.name,
        version: values.version,
        deployedDate: new Date(values.deployedDate),
        releasedDate: new Date(values.releasedDate),
        description: values.description,
        developers: {
          lead: values.developer,
          team: [values.developer],
        },
        releaseNotes: [
          {
            version: values.version,
            date: new Date(values.releasedDate),
            notes: "Initial release."
          },
        ],
        plan: values.plan,
      };
      await handleRegisterFeature(featureExists, appFeature, featureId);
    } catch (error: any) {
      toast.error(error?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
      await onReset();
    }
  });

  return {
    methods,
    onHandleSubmit,
    onRegisterApp,
    loading,
  };
};
