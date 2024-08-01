"use client"; 

import * as React from "react";
import { PayPalScriptProvider, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";

const orderOptions: ReactPayPalScriptOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
};

const subscriptionOptions: ReactPayPalScriptOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    intent: "subscription",
    vault: true
};

export const PaypalOrderClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <PayPalScriptProvider options={orderOptions}>
            {children}
        </PayPalScriptProvider>
    );
};

export const PaypalSubscriptionClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <PayPalScriptProvider options={subscriptionOptions}>
            {children}
        </PayPalScriptProvider>
    );
};
