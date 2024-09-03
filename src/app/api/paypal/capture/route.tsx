"use server";
import { NextApiRequest, NextApiResponse } from "next";
import { currentUser } from '@clerk/nextjs/server';
import { client } from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk';

export async function POST(req: Request): Promise<Response> {
  const user = await currentUser();

  if (!user) {
    return new Response("User not authenticated", { status: 401 });
  }

  const { orderID } = await req.json();
  if (!orderID ) {
    return new Response("Missing arguments", { status: 400 });
  }

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const response = await client().execute(request);
    if (!response) {
      return new Response("Some Error Occurred at backend", { status: 500 });
    }

    return new Response(JSON.stringify(response.result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
