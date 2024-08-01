"use client";
import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePaymentContextHook } from "@/context/payment-context-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FaRegCreditCard, FaCoins } from 'react-icons/fa';

export default function Billing() {
  const router = useRouter();
  const { paymentType, setPaymentType } = usePaymentContextHook();
  const currentUser = useQuery(api.users.getCurrentUser);
  
  if (!currentUser) return null;
  
  const currentPlan = currentUser?.subscriptionInfo?.plan || "FREE";
  const currentCredit = currentUser?.creditInfo?.credit || 0;

  const handlePaymentEvent = (type) => {
    router.push("/settings/billing/payment");
    setPaymentType(type);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Billing Dashboard</h1>
      <Tabs 
        aria-label="Billing"
        radius="full"
        color="warning"
        className="mb-8"
      >
        <Tab key="subscription" title={
          <div className="flex items-center space-x-2">
            <FaRegCreditCard />
            <span>Subscription</span>
          </div>
        }>
          <Card className="rounded-lg shadow-lg">
            <CardBody className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Subscription</h2>
              <div className="mb-6">
                <h3 className="text-xl mb-2">
                  Current Plan: <span className="font-bold bg-yellow-200 text-yellow-800 rounded-full px-4 py-1 ml-2">{currentPlan}</span>
                </h3>
                <p className="text-gray-600">
                  You're using the <span className="font-semibold">{currentPlan}</span> plan of WApp. Upgrade to unlock advanced features and enhance your experience.
                </p>
              </div>
              <Button 
                onClick={() => handlePaymentEvent("SUBSCRIPTION")} 
                className="w-full max-w-md mx-auto hover:to-red-600 text-white font-bold py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                Upgrade Now
              </Button>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="credit" title={
          <div className="flex items-center space-x-2">
            <FaCoins />
            <span>Credit</span>
          </div>
        }>
          <Card className="rounded-lg shadow-lg">
            <CardBody className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Credit Balance</h2>
              <div className="mb-6">
                <h3 className="text-xl mb-2">
                  Available Credit: <span className="font-bold bg-green-200 text-green-800 rounded-full px-4 py-1 ml-2">{currentCredit}</span>
                </h3>
                <p className="text-gray-600">
                  Use your credits to access <span className="font-semibold">ADVANCED</span> AI features of WApp. Purchase more to continue enjoying premium capabilities.
                </p>
              </div>
              <Button 
                onClick={() => handlePaymentEvent("CREDIT")} 
                className="w-full max-w-md mx-auto text-white font-bold py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                Purchase Credits
              </Button>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}