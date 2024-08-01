import { createClerkClient } from '@clerk/backend';

export async function POST(req: Request): Promise<Response> {

  if (!process.env.CLERK_SECRET_KEY) {
    return new Response(
      "Missing CLERK_SECRET_KEY - make sure to add it to your .env file.",
      {
        status: 400,
      },
    );
  }

  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  let { organizationId } = await req.json();

  try {
    const memberships = await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: organizationId,
    });

    return new Response(JSON.stringify({ memberships: memberships }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error('Error fetching memberships:', error);
    return new Response("Failed to fetch memberships", {
      status: 500,
    });
  }
}
