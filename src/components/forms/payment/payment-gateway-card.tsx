'use client';
import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreditCard } from 'lucide-react';
import PaypalButtonComponent from "@/components/paypal/button";
import StripeButtonComponent from "@/components/stripe/button";
import { createOrder, onApproveOrder, onErrorOrderPayment, createSubscription, onApproveSubscription, onErrorSubscriptionPayment, onCancelSubscription } from "@/actions/payments/paypal";
import { createParams, onError } from "@/actions/payments/stripe";
import { usePaymentContextHook } from "@/context/payment-context-provider";
import { getPlanAIModelIdByName } from "@/actions/ai";
import { planSubscriptionInfo } from "@/constants/payments";
import { toast } from "sonner";

const PaymentGatewayCard = () => {
  const { paymentGateway, paymentType, purchasePriceInfo, modelType, planType } = usePaymentContextHook();
  const currentUser = useQuery(api.users.getCurrentUser);
  const updateModel = useMutation(api.models.updateModel);
  const updateUserCredit = useMutation(api.users.updateUserCredit);
  const updateUserSubscription = useMutation(api.users.updateUserSubscription);
  const updateModelInfo = useMutation(api.users.updateModelInfo);
  const cloudModels = useQuery(api.models.getAllModels);

  const getEventType = useCallback(() => {
    if (paymentGateway === "PAYPAL") {
      return {
        type: paymentType === "SUBSCRIPTION"
          ? "BILLING.PAYMENT.SUBSCRIPTION"
          : "BILLING.PAYMENT.ORDER"
      };
    } else if (paymentGateway === "STRIPE") {
      return {
        type: paymentType === "SUBSCRIPTION"
          ? "BILLING.PAYMENT.SUBSCRIPTION"
          : "BILLING.PAYMENT.ORDER"
      };
    }
    return null;
  }, [paymentGateway, paymentType]);

  const SwitchComponent = () => {
    const eventType = getEventType();
    switch (true) {
      case paymentGateway === "PAYPAL" && paymentType === "SUBSCRIPTION":
        const planInfo = planSubscriptionInfo.find(plan => plan.planName === planType);
        if (!planInfo) {
          toast.error("Invalid plan selected.");
          return null;
        }
        const SubPaypalParams = {
          planId: planInfo.planID,
        };
        const SubPaypalInputData = {
          service: "WAPP",
          product: `WAPP-${planType}-PLAN`,
          event: eventType,
          planType: planType,
          planId: planInfo.planID,
          cloudUserId: currentUser?.cloudUserId,
        }
        return (
          <PaypalButtonComponent 
            event={eventType}
            createAction={(data, actions) => createSubscription(SubPaypalParams, actions)} 
            onApprove={(data, actions) => onApproveSubscription(data, SubPaypalInputData, actions, updateUserSubscription)} 
            onError={onErrorSubscriptionPayment} 
            onCancel={() => onCancelSubscription(SubPaypalInputData.planId)}
          />
        );

      case paymentGateway === "PAYPAL" && paymentType === "CREDIT":
        if (Object.values(purchasePriceInfo).length === 0) {
          toast.error("No product has been selected.");
          return null;
        }
        const productId = Object.keys(purchasePriceInfo)[0];
        const productQuantity = purchasePriceInfo[productId]?.totalPrice;
        if (!cloudModels || !modelType) {
          console.error("Cloud models or input model is missing");
          return null;
        }
        const modelToUpdate = cloudModels.find(item => item.model === modelType);
        if (!modelToUpdate) {
          console.error("Model not found in cloud models");
          return null;
        }
        const convexModelId = modelToUpdate.cloudModelId;
        const normalizedModel = productId.replace(/[-.]/g, '_');
        const prismaModelId = getPlanAIModelIdByName(normalizedModel);
        if (!currentUser?.cloudUserId) {
          console.error("Cloud user ID is missing");
          return null;
        }

        const crePaypalParams = {
          event: eventType,
          cloudUserId: currentUser.cloudUserId,
          convexModelId,
          prismaModelId,
          productId,
          productQuantity,
          productInfo: {
            inputTokens: purchasePriceInfo[productId]?.inputTokens,
            outputTokens: purchasePriceInfo[productId]?.outputTokens
          }
        };

        return (
          <PaypalButtonComponent
            event={eventType}
            createAction={(data, actions) => createOrder(crePaypalParams, actions)}
            onApprove={(data, actions) => onApproveOrder(data, crePaypalParams, updateUserCredit, updateModelInfo, updateModel)}
            onError={onErrorOrderPayment}
          />
        );
        
      case paymentGateway === "STRIPE" && paymentType === "SUBSCRIPTION":
        const SubStripeParams = {
          priceId: "1222222222222222",
          trial_period_days: 14,
          quantity: 1
        };

        return (
          <StripeButtonComponent 
            event={eventType} 
            createParams={createParams} 
            onError={onError}
            params={SubStripeParams}
          />
        );

      case paymentGateway === "STRIPE" && paymentType === "CREDIT":
        const CreStripeParams = {
          priceId: "1222222222222222",
          quantity: 1
        };

        return (
          <StripeButtonComponent 
            event={eventType} 
            createParams={createParams} 
            onError={onError}
            params={CreStripeParams}          
          />
        );

      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-lg rounded-xl p-4">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <CreditCard size={40} className="mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            {paymentGateway === "STRIPE" ? "Pay with Stripe" : "Pay with PayPal"}
          </h2>
          <p className="text-sm opacity-80">
            Secure and convenient payment processing
          </p>
        </div>
        <div className="p-6 bg-white">
          <Image
            className="mx-auto mb-6"
            width={120}
            height={120}
            src={paymentGateway === "STRIPE" ? "/global/payment_logos/stripe_logo.png" : "/global/payment_logos/paypal_logo.png"}
            alt={paymentGateway === "STRIPE" ? "Stripe Logo" : "PayPal Logo"}
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-sm text-gray-600">
              {paymentType === "SUBSCRIPTION" ? "Subscribe to our service" : "Purchase credits"}
            </div>
            <SwitchComponent />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentGatewayCard;


