import { NextRequest } from "next/server";
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { subscriptionID } = await req.json();
    
    if (!subscriptionID) {
      return new Response(JSON.stringify({ error: "Missing subscriptionID in request body" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const paypalApiUrl = 'https://api.paypal.com/v1/billing/subscriptions/' + subscriptionID + '/cancel';
    const accessToken = await getPayPalAccessToken();
    const response = await fetch(paypalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error_description || "Failed to cancel subscription");
    }

    const responseData = await response.json();
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const tokenUrl = 'https://api.paypal.com/v1/oauth2/token';
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve PayPal access token');
  }

  const responseData = await response.json();
  return responseData.access_token;
}