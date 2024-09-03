import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { WebhookEvent } from "@clerk/nextjs/server";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;
    try {
      const result: WebhookEvent = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      switch (result.type) {
        case "organizationMembership.updated":
        case "organizationMembership.created":
          const userOrgs = await ctx.runAction(internal.clerk.getUserOrganizations, {
            userId: result.data.public_user_data.user_id
          });
          await ctx.runMutation(internal.memberships.addUserIdsToOrgs, {
            userId: result.data.public_user_data.user_id,
            orgIds: userOrgs.data.map((org: { id: string }) => org.id),
          });
          break;
        case "organizationMembership.deleted":
          await ctx.runMutation(internal.memberships.removeUserIdFromOrg, {
            userId: result.data.public_user_data.user_id,
            orgId: result.data.organization.id,
          });
          break;
      }
      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;