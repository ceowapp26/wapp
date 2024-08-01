import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const { event, params } = await request.json();
    let options;

    if (event.type === "BILLING.PAYMENT.ORDER") {
      const { priceId, quantity } = params;
      options = {
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity
          }
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_BASE_URL}/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_BASE_URL}/settings/billing`,
      };
    } else if (event.type === "BILLING.PAYMENT.SUBSCRIPTION") {
      const { priceId, quantity, trial_period_days } = params;
      options = {
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity
          }
        ],
        subscription_data: {
          trial_end: trial_period_days
        },
        mode: 'subscription',
        success_url: `${process.env.NEXT_BASE_URL}/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_BASE_URL}/settings/billing`,
      };
    }

    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(options);
    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


