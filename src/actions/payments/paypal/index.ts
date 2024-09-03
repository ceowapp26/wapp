import { PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { SubscriptionPayment, CreditPayment } from "@/types/payment";
import { Dispatch } from "react";
import { time } from "@/utils/time"; 
import { CloudModel } from '@/types/users';
import { changePlanAIModel, getPlanAIModelById } from '@/actions/ai';
import { usePaymentContextHook } from "@/context/payment-context-provider";

interface OrderData {
    id: string;
    details?: Array<{
        issue: string;
        description: string;
    }>;
    debug_id?: string;
}

interface OnCurrencyChangeProps {
    target: { value: string };
    setCurrency: (value: string) => void;
    currency: string;
    dispatch: Dispatch<any>;
    options: any; 
}

export const onCurrencyChange = ({ target: { value }, setCurrency, dispatch, options }: OnCurrencyChangeProps) => {
    setCurrency(value);
    dispatch({
        type: "resetOptions",
        value: {
            ...options,
            currency: value,
        },
    });
};

export const createSubscription: PayPalButtonsComponentProps["createSubscription"] = (data, actions) => {
    return actions.subscription.create({
        "plan_id": data.planId
    });
}

export const onApproveSubscription: PayPalButtonsComponentProps["onApprove"] = async (data, inputData, actions, updateUserSubscription) => {
  try {
    const subscriptionDetails = await actions.subscription.get();
    const paymentData = {
      transactionId: subscriptionDetails.id,
      transactionType: inputData.event.type,
      service: inputData.service,
      product: inputData.product,
      amountPaid: parseFloat(subscriptionDetails.billing_info.last_payment.amount.value),
      amountDue: parseFloat(subscriptionDetails.billing_info.outstanding_balance.value),
      quantity: parseInt(subscriptionDetails.quantity),
      status: subscriptionDetails.status,
      currency: subscriptionDetails.billing_info.last_payment.amount.currency_code,
      planType: inputData.planType,
      planId: subscriptionDetails.plan_id,
      paidDate: new Date(subscriptionDetails.billing_info.last_payment.time).toISOString(),
      dueDate: new Date(subscriptionDetails.billing_info.next_billing_time).toISOString(),
    };
    await updateUserSubscription({ id: inputData.cloudUserId, data: paymentData });
    alert(`You have successfully subscribed to ${inputData.planType}`);
  } catch (error) {
    console.error("Subscription approval error:", error);
    alert("There was an error processing your subscription. Please try again.");
  }
};

export const onErrorSubscriptionPayment: PayPalButtonsComponentProps["onError"] = (error) => {
    console.error("Payment error:", error);
    alert("There was an error processing your payment. Please try again.");
};

export const createOrder: PayPalButtonsComponentProps["createOrder"] = async (data, actions) => {
    const { productId, productQuantity, productInfo, cloudUserId, prismaModelId, convexModelId, event } = data;

    try {
        const response = await fetch("/api/paypal/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: productId,
                quantity: productQuantity,
                event: event,
            }),
        });

        const orderData = await response.json();
        if (!orderData.id) {
            const errorDetail = orderData?.details ? orderData.details[0] : undefined;
            const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : "Unexpected error occurred, please try again.";

            throw new Error(errorMessage);
        }

        return orderData.id; 
    } catch (error) {
        console.error("Order creation error:", error);
        throw error;
    }
};

export const onApproveOrder: PayPalButtonsComponentProps["onApprove"] = async (data, inputData, updateUserCredit, updateModelInfo, updateModel) => {
    try {
        const { setPurchasePriceInfo } = usePaymentContextHook();

        const response = await fetch("/api/paypal/capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                orderID: data.orderID,
            }),
        });

        const orderData = await response.json();

        if (!orderData || !orderData.purchase_units || !orderData.purchase_units[0].payments.captures || !orderData.purchase_units[0].payments.captures[0]) {
            throw new Error("Failed to capture payment or invalid response from PayPal.");
        }

        const captureData = orderData.purchase_units[0].payments.captures[0];

        const amountPaid = parseFloat(captureData.amount.value);

        const paymentData: CloudModel = {
            transactionId: data.orderID,
            transactionType: inputData.event.type,
            service: inputData.productId,
            product: inputData.product,
            quantity: data.productQuantity,
            amountPaid: amountPaid,
            amountDue: 0,
            status: orderData.status,
            currency: captureData.amount.currency_code,
            credit: inputData.productQuantity,
            paidDate: new Date().toISOString(),
            dueDate: new Date().toISOString(),
        };
        const convexModelData: CloudModel = {
            model: inputData.productId,
            purchased_max_inputTokens: inputData.productInfo.inputTokens,
            purchased_max_outputTokens: inputData.productInfo.outputTokens,
            purchasedAmount: amountPaid,
        };
        const currentModel = await getPlanAIModelById(inputData.prismaModelId);
        currentModel.purchasedMaxInputTokens -= inputData.productInfo.inputTokens;
        currentModel.purchasedMaxOutputTokens -= inputData.productInfo.outputTokens;
        const prismaModelData: CloudModel = {
            model: inputData.productId,
            purchased_max_inputTokens: inputData.productInfo.inputTokens,
            purchased_max_outputTokens: inputData.productInfo.outputTokens,
            purchasedAmount: amountPaid,
        };
        await changePlanAIModel(inputData.prismaModelId, currentModel)
        await updateUserCredit({ id: inputData.convexModelId, data: paymentData });
        await updateModel({ id: inputData.convexModelId, data: convexModelData });
        await updateModelInfo({ id: inputData.convexModelId, models: convexModelData });
        setPurchasePriceInfo({})
        alert(`Transaction completed by ${orderData.id}`);
    } catch (error) {
        console.error("Order approval error:", error);
    }
};    

export const onErrorOrderPayment: PayPalButtonsComponentProps["onError"] = (error) => {
    console.error("Payment error:", error);
};

export const onCancelSubscription = async (subscriptionId: string) => {
    try {
        const response = await fetch(`/api/cancel-subscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscriptionId }),
        });

        if (!response.ok) {
            throw new Error('Failed to cancel subscription');
        }

        const result = await response.json();
        alert("Your subscription has been cancelled successfully.");
        // You might want to update the UI or user's subscription status here
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        alert("There was an error cancelling your subscription. Please try again or contact support.");
    }
};