'use server'

import { client } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  typescript: true,
  apiVersion: '2024-04-10',
})

export const onCreateCustomerPaymentIntentSecret = async (
  amount: number,
  stripeId: string
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        currency: 'usd',
        amount: amount * 100,
        automatic_payment_methods: {
          enabled: true,
        },
      },
      { stripeAccount: stripeId }
    )

    if (paymentIntent) {
      return { secret: paymentIntent.client_secret }
    }
  } catch (error) {
    console.log(error)
  }
}

export const onUpdateSubscription = async (
  plan: 'STANDARD' | 'PRO' | 'ULTIMATE'
) => {
  try {
    const user = await currentUser()
    if (!user) return
    const update = await client.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        subscription: {
          update: {
            data: {
              plan,
              credits: plan == 'PRO' ? 50 : plan == 'ULTIMATE' ? 500 : 10,
            },
          },
        },
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })
    if (update) {
      return {
        status: 200,
        message: 'subscription updated',
        plan: update.subscription?.plan,
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const setPlanAmount = (item: 'STANDARD' | 'PRO' | 'ULTIMATE') => {
  if (item == 'PRO') {
    return 1500
  }
  if (item == 'ULTIMATE') {
    return 3500
  }
  return 0
}

export const onGetStripeClientSecret = async (
  item: 'STANDARD' | 'PRO' | 'ULTIMATE'
) => {
  try {
    const amount = setPlanAmount(item)
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'usd',
      amount: amount,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    if (paymentIntent) {
      return { secret: paymentIntent.client_secret }
    }
  } catch (error) {
    console.log(error)
  }
}



interface OrderData {
  id: string;
  error?: {
    message: string;
  };
}

// Function to create an order
export const createOrder = async (productId: string, productQuantity: number) => {
  try {
    // Create a new order with the product ID and quantity
    const order = await stripe.orders.create({
      currency: "usd",
      items: [
        {
          type: "sku",
          parent: productId,
          quantity: productQuantity,
        },
      ],
    });

    // Return the order ID
    return order.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Function to capture the payment for an order
export const capturePayment = async (orderID: string) => {
  try {
    // Capture the payment for the order
    const paymentIntent = await stripe.paymentIntents.capture(orderID);

    // Return the payment intent
    return paymentIntent;
  } catch (error) {
    console.error("Error capturing payment:", error);
    throw error;
  }
};

// Function to handle payment approval
export const handlePaymentApproval = async (data) => {
  try {
    // Capture the payment for the order
    const paymentIntent = await capturePayment(data.orderID);

    // Get the name of the payer from the payment intent
    const name = paymentIntent.charges.data[0].billing_details.name;

    // Display a success message
    alert(`Transaction completed by ${name}`);
  } catch (error) {
    console.error("Error handling payment approval:", error);
    throw error;
  }
};

// Function to handle payment approval
export const handlePayment = async (data) => {
  try {
    // Capture the payment for the order
    const paymentIntent = await capturePayment(data.orderID);

    // Get the name of the payer from the payment intent
    const name = paymentIntent.charges.data[0].billing_details.name;

    // Display a success message
    alert(`Transaction completed by ${name}`);
  } catch (error) {
    console.error("Error handling payment approval:", error);
    throw error;
  }
};

export const createParams = (event: any, options: any) => {
  if (event.type === "BILLING.PAYMENT.ORDER") {
    return {
      event: event,
      params: {
        priceId: options.priceId,
        quantity: options.quantity
      }
    };
  } else if (event.type === "BILLING.PAYMENT.SUBSCRIPTION") {
    return {
      event: event,
      params: {
        priceId: options.priceId,
        quantity: options.quantity,
        trial_end: calculateTrialEndUnixTimestamp(options.trial_period_days)
      }
    };
  }
};

const calculateTrialEndUnixTimestamp = (trialPeriodDays: number) => {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + trialPeriodDays);
  return Math.floor(trialEndDate.getTime() / 1000);
};

export const onError = () => {
  console.log("This is failed");
};
