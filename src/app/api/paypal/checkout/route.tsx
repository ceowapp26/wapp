"use server"
import { NextApiRequest, NextApiResponse } from "next";
import { currentUser } from '@clerk/nextjs/server';
import { client } from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk'

export async function POST(req: Request): Promise<Response> {
  const user = await currentUser();
  if (!user) {
    return new Response("User not authenticated", { status: 401 });
  }
  const { event, id, quantity } = await req.json();

  if (!id && !event && !quantity) {
    return new Response("Missing ID", { status: 400 });
  }

  const order_price = quantity * 0.01;

  try {
    let response;
    if (event.type === "BILLING.PAYMENT.ORDER") {
      const request = new paypal.orders.OrdersCreateRequest();
      request.headers['prefer'] = 'return=representation';
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: order_price.toString(),
            },
          },
        ],
      });
      response = await client().execute(request);
      return new Response(JSON.stringify(response.result), { status: 201 });
    } else {
      return new Response("Invalid event type", { status: 400 });
    }
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
