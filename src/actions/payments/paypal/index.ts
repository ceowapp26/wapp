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

export const onApproveSubscription: PayPalButtonsComponentProps["onApprove"] = async (data, inputData, actions) => {
  try {
    const captureData = data.purchase_units[0].payments.captures[0];
    const amountPaid = parseFloat(data.amount.value);
    const paymentData = {
      transactionId: data.subscriptionId,
      service: "wapp",
      product: "wapp",
      amountPaid: data.purchase_units[0].payments.captures[0].amount.value,
      status: data.status,
      currency: data.purchase_units[0].payments.captures[0].amount.currency_code,
      plan: inputData.planId,
      paidDate: new Date().toISOString(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    };

    await updateUserSubscription({ id: inputData.cloudUserId, data: paymentData });
    alert(`You have successfully subscribed to ${data.planID}`);
  } catch (error) {
    console.error("Subscription approval error:", error);
  }
};


export const onErrorSubscriptionPayment: PayPalButtonsComponentProps["onError"] = (error) => {
    console.error("Payment error:", error);
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
            service: inputData.productId,
            product: inputData.productId,
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


export const cancelSubscription = async (subscriptionId: string) => {
    try {
        const response = await fetch(`/api/paypal/cancel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subscriptionId }),
        });

        if (!response.ok) {
            throw new Error("Failed to cancel the subscription");
        }
        const result = await response.json();
        alert(`Subscription ${subscriptionId} has been successfully canceled.`);
    } catch (error) {
        console.error("Subscription cancellation error:", error);
        alert("Failed to cancel the subscription. Please try again.");
    }
};
