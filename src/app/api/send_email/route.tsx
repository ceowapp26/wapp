import cron from 'node-cron';
import { sendCustomEmail } from '@/actions/mail'; 

export async function POST(req: Request): Promise<Response> { 
 
  const { cronExpression, template } = await req.json();

  if (!cronExpression || !template) {
    return new Response(
      "Missing required fields",
      {
        status: 400,
      },
    );
  }

  try {
    cron.schedule(cronExpression, () => {
      sendCustomEmail(template);
      //console.log(`Cron job executed at ${new Date().toISOString()}`);
    });
     return new Response(
      "Email scheduled successfully",
      {
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error scheduling email:', error);
    return new Response(
      "Internal Server Error",
      {
        status: 500,
      },
    );
  }
}
