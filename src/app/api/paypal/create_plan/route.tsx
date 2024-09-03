import { NextRequest, NextResponse } from "next/server";

const PAYPAL_SANDBOX_URL = 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const tokenUrl = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('PayPal API Error:', response.status, errorBody);
      throw new Error(`PayPal API responded with status ${response.status}: ${errorBody}`);
    }

    const responseData = await response.json();
    return responseData.access_token;
  } catch (error) {
    console.error('Error in getPayPalAccessToken:', error);
    throw error;
  }
}

async function createPlan(accessToken: string, planDetails: any) {
  const response = await fetch(`${PAYPAL_SANDBOX_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(planDetails),
  });

  if (!response.ok) {
    throw new Error('Failed to create plan');
  }

  return response.json();
}

export async function POST(req: NextRequest) {
  try {
    const planDetails = await req.json();
    const accessToken = await getPayPalAccessToken();
    const createdPlan = await createPlan(accessToken, planDetails);

    return NextResponse.json(createdPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

