import { ModelOption } from "@/constants/ai";

type PLAN_TYPE = 'FREE' | 'STANDARD' | 'PRO' | 'ULTIMATE'; 

interface App {
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

interface AppBilling {
  id: string;
  appId: string;
  app: App;
  price: string;
}

interface Feature {
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
  plan: PLAN_TYPE;
}

interface Service {
  id: string;
  name: string;
  version: string;
  deployedDate: Date;
  releasedDate: Date;
  description?: string | null;
  developers: Record<string, any>; 
  releaseNotes: any[]; 
  license: Record<string, any>;
  platforms: string;
  watermark?: string | null;
  domain: string;

  serviceBillings: ServiceBilling[];
  subscribers: Subscriber[];
  features: Feature[];
}

interface ServiceBilling {
  id: string;
  serviceId: string;
  service: Service;
  price: string;
}

type STATUS_PROPS = {
  text: string;
  color: string;
  icon?: React.ReactNode; 
};

interface Model {
  model: ModelOption;
  RPM: number;     // max requests per minute
  RPD: number;     // max requests per day
  TPM: number;
  TPD: number;
}

export type PLANDATA = {
  title: string;
  monthlyPrice: number,
  yearlyPrice: number,
  description: string;
  apps: App[],
  features: Feature[];
  models: Model[];
  actionLabel: string;
};

