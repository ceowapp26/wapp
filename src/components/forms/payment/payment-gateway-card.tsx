'use client';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreditCard } from 'lucide-react';
import React from 'react';
import PaypalButtonComponent from "@/components/paypal/button";
import StripeButtonComponent from "@/components/stripe/button";
import { createOrder, onApproveOrder, onErrorOrderPayment, createSubscription, onApproveSubscription, onErrorSubscriptionPayment } from "@/actions/payments/paypal";
import { createParams, onError } from "@/actions/payments/stripe";
import { useStore } from "@/redux/features/apps/document/store";
import { usePaymentContextHook } from "@/context/payment-context-provider";
import { defaultModel } from "@/constants/ai";
import { getPlanAIModelIdByName } from "@/actions/ai";
import { toast } from "sonner";

type Props = {};

const PaymentGatewayCard = (props: Props) => {
  const inputContext = useStore((state) => state.inputContext);
  const inputModel = useStore((state) => state.inputModel);
  const { paymentGateway, paymentType, purchasePriceInfo } = usePaymentContextHook();
  const currentUser = useQuery(api.users.getCurrentUser);
  const updateModel = useMutation(api.models.updateModel);
  const updateUserCredit = useMutation(api.users.updateUserCredit);
  const updateUserSubscription = useMutation(api.users.updateUserSubscription);
  const updateModelInfo = useMutation(api.users.updateModelInfo);
  const cloudModels = useQuery(api.models.getAllModels);

  const SwitchComponent = () => {
    switch (true) {
      case paymentGateway === "PAYPAL" && paymentType === "SUBSCRIPTION":
        const eventPaypalSub = {
          type: "BILLING.PAYMENT.SUBSCRIPTION"
        };
        const SubPaypalParams = {
          event: eventPaypalSub,
          cloudUserId: currentUser?.cloudUserId,
          planId: "P-3RX065706M3469222L5IFM4I",
        };

        return (
          <PaypalButtonComponent 
            event={eventPaypalSub} 
            createAction={(data, actions) => createSubscription(SubPaypalParams, actions)} 
            onApprove={(data, actions) => onApproveSubscription(data, updateUserSubscription)} 
            onError={onErrorSubscriptionPayment} 
          />
        );

      case paymentGateway === "PAYPAL" && paymentType === "CREDIT":
        const eventPaypalCre = { type: "BILLING.PAYMENT.ORDER" };
        
        if (Object.values(purchasePriceInfo).length === 0) {
          toast.error("No product has been selected.");
          return;
        }

        const productId = Object.keys(purchasePriceInfo).pop();
        const productQuantity = purchasePriceInfo[productId]?.totalPrice;

        if (!cloudModels || !inputModel) {
          console.error("Cloud models or input model is missing");
          return;
        }

        const modelToUpdate = cloudModels.find(item => item.model === inputModel);
        
        if (!modelToUpdate) {
          console.error("Model not found in cloud models");
          return;
        }

        const convexModelId = modelToUpdate.cloudModelId;
        const normalizedModel = productId.replace(/[-.]/g, '_');
        const prismaModelId = getPlanAIModelIdByName(normalizedModel);

        if (!currentUser?.cloudUserId) {
          console.error("Cloud user ID is missing");
          return;
        }

        const crePaypalParams = {
          event: eventPaypalCre,
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
            event={eventPaypalCre}
            createAction={(data, actions) => createOrder(crePaypalParams, actions)}
            onApprove={(data, actions) => onApproveOrder(data, crePaypalParams, updateUserCredit, updateModelInfo, updateModel)}
            onError={onErrorOrderPayment}
          />
        );
        
      case paymentGateway === "STRIPE" && paymentType === "SUBSCRIPTION":
        const eventStripeSub = {
          type: "BILLING.PAYMENT.SUBSCRIPTION"
        };

        const SubStripeParams = {
          priceId: "1222222222222222",
          trial_period_days: 14,
          quantity: 1
        };

        return (
          <StripeButtonComponent 
            event={eventStripeSub} 
            createParams={createParams} 
            onError={onError}
            params={SubStripeParams}
          />
        );

      case paymentGateway === "STRIPE" && paymentType === "CREDIT":
        const eventStripeCre = {
          type: "BILLING.PAYMENT.ORDER"
        };

        const CreStripeParams = {
          priceId: "1222222222222222",
          quantity: 1
        };

        return (
          <StripeButtonComponent 
            event={eventStripeCre} 
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


