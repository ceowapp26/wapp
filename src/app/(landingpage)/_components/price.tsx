"use client"
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Zap } from 'lucide-react';
import { PLANS } from '@/constants/app';
import { App, Feature, Model } from '@/types/app';
import { getPlanAIModelsByPlan } from '@/actions/ai';
import { getAppsByPlan, getFeaturesByPlan } from '@/actions/app';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { calculateFloorMAR } from '@/utils/APILimitUtils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
} from "@nextui-org/react";

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

type PricingCardProps = {
  isYearly?: boolean;
  title: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description: string;
  apps: App[];
  features: Feature[];
  models: Model[];
  actionLabel: string;
  popular?: boolean;
};

const ApiLimits = ({ data }: { data: Model[] }) => (
  <div className="overflow-x-auto">
    <Table aria-label="API Limits Table" className="mt-4 min-w-full">
      <TableHeader>
        <TableColumn>Model</TableColumn>
        <TableColumn>RPM</TableColumn>
        <TableColumn>RPD</TableColumn>
        <TableColumn>TPM</TableColumn>
        <TableColumn>TPD</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map((model, index) => (
          <TableRow key={index}>
            <TableCell>{model.model}</TableCell>
            <TableCell>{model.RPM}</TableCell>
            <TableCell>{model.RPD}</TableCell>
            <TableCell>{model.TPM}</TableCell>
            <TableCell>{model.TPD}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <motion.section 
    className="text-center mb-12"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-4">{title}</h2>
    <p className="text-2xl md:text-3xl text-fuchsia-800 dark:text-gray-300">{subtitle}</p>
  </motion.section>
);

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="w-full max-w-xs mx-auto mb-12"
  >
    <Tabs defaultValue="0" className="w-full bg-gray-100 dark:bg-gray-800 rounded-full" onValueChange={onSwitch}>
      <TabsList className="grid grid-cols-2 gap-2">
        <TabsTrigger value="0" className="text-sm py-2 rounded-full">Monthly</TabsTrigger>
        <TabsTrigger value="1" className="text-sm py-2 rounded-full">Yearly</TabsTrigger>
      </TabsList>
    </Tabs>
  </motion.div>
);

const PricingCard = ({
  isYearly,
  title,
  monthlyPrice,
  yearlyPrice,
  description,
  apps,
  features,
  models,
  actionLabel,
  popular,
  isLoading,
}: PricingCardProps) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="w-full"
  >
    <Card className={`h-full flex flex-col justify-between py-8 px-6 ${
      popular ? 'border-2 border-purple-500 shadow-lg' : 'border border-gray-200 dark:border-gray-700'
    } rounded-3xl`}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold">{title}</CardTitle>
        {popular && (
          <span className="inline-block bg-purple-100 text-purple-800 text-sm px-4 py-1 rounded-full font-semibold">
            Most Popular
          </span>
        )}
        <CardDescription className="text-lg text-gray-600 dark:text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 flex-grow">
        <div className="mb-6">
          <span className="text-5xl font-bold">
            {isYearly ? `$${yearlyPrice}` : `$${monthlyPrice}`}
          </span>
          <span className="text-xl text-gray-500 dark:text-gray-400">
            {isYearly ? '/year' : '/month'}
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-xl mb-3">App Access</h3>
            {Object.values(apps).map((app) => (
              <CheckItem key={app.name} text={app.name} />
            ))}
            <h3 className="font-semibold text-xl mt-6 mb-3">Features</h3>
            {Object.values(features).map((feature) => (
              <CheckItem key={feature.name} text={`${feature.name} (${feature.app})`} />
            ))}
            <h3 className="font-semibold text-xl mt-6 mb-3">API Limits</h3>
            <ApiLimits data={models} />
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full py-3 text-white font-medium text-lg rounded-xl transition-colors ${
            popular ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex items-center space-x-3 mb-2">
    <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
    <p className="text-base text-gray-700 dark:text-gray-300">{text}</p>
  </div>
);

const PriceSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  const togglePricingPeriod = (value: string) => setIsYearly(parseInt(value) === 1);
  const [planData, setPlanData] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const allUsers = useQuery(api.users.getAllUsers);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const numOfUsers = allUsers ? allUsers.length : 0;
        const data = await Promise.all(
          PLANS.map(async (plan) => {
            const [features, apps, models] = await Promise.all([
              getFeaturesByPlan(plan.title),
              getAppsByPlan(plan.title),
              getPlanAIModelsByPlan(plan.title)
            ]);
            return {
              ...plan,
              apps: apps,
              features: features,
              models: models.map((model) => ({
                model: model.name,
                RPM: calculateFloorMAR(model.floorRPM, allUsers.length),
                RPD: calculateFloorMAR(model.floorRPD, allUsers.length),
                TPM: calculateFloorMAR(model.floorTPM, allUsers.length),
                TPD: calculateFloorMAR(model.floorTPD, allUsers.length),
              })),
            };
          })
        );
        setPlanData(data);
      } catch (error) {
        console.error("Error fetching plan data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (allUsers && allUsers.length > 0) {
      fetchData();
    }
  }, [allUsers]);

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto overflow-y-auto">
      <PricingHeader title="Choose Your Plan" subtitle="Flexible options for every need" />
      <PricingSwitch onSwitch={togglePricingPeriod} />
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          </motion.div>
        ) : (
          <motion.section 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {planData.map((plan, index) => (
              <motion.div 
                key={plan.title} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="w-full"
              >
                <PricingCard 
                  {...plan} 
                  isYearly={isYearly} 
                  isLoading={false}
                />
              </motion.div>
            ))}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriceSection;
