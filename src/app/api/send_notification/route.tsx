import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import serviceAccount from '@/lib/wapp-f36bd-firebase-adminsdk-ecc7n-ebbf2cb293.json';
import { getAuth } from "firebase-admin/auth";

const alreadyCreatedAps = getApps();
const yourFirebaseAdminConfig= {}

const firebaseApp =
  alreadyCreatedAps.length === 0
    ? initializeApp({credential: cert(serviceAccount)})
    : alreadyCreatedAps[0];

export async function POST(request: Request): Promise<Response> {
  try {
    const registrationTokens = [];
    const { tokens, data } = await request.json();

    if (!tokens || tokens.length === 0) {
      return new Response(
        "No tokens provided",
        {
          status: 400,
        }
      );
    } else {
      registrationTokens.push(...tokens.map((t: { token: string }) => t.token));
    }

    const payload = {
      tokens: registrationTokens,
      notification: {
        body: data.content,
        title: data.title
      },
      data: { type: data.type },
    };
    const messaging = getMessaging(firebaseApp); 
    const response = await messaging.sendMulticast(payload);

    console.log(response.successCount + ' messages were sent successfully');
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(registrationTokens[idx]);
        }
      });
      console.log('List of tokens that caused failures: ' + failedTokens);
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      error.message,
      {
        status: 500,
      }
    );
  }
}
