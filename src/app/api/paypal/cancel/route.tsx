import { NextApiRequest, NextApiResponse } from "next";
import { currentUser } from '@clerk/nextjs/server';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await currentUser();

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { subscriptionID } = req.body;

    if (!subscriptionID) {
      return res.status(400).json({ error: "Missing subscriptionID in request body" });
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
    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return res.status(500).json({ error: "Internal server error" });
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
