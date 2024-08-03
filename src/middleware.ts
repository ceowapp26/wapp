import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn, createRouteMatcher } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ['/', '/auth(.*)'],
  ignoredRoutes: ['/chatbot'],
  afterAuth(auth, req, evt) {
    const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/developer(.*)', '/owner(.*)', '/business(.*)']);
    const isAuthenticatedRoute = createRouteMatcher(['/home(.*), /myspace(.*)']);

    if (!auth?.userId && !auth?.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (isAuthenticatedRoute(req) && !auth?.userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (isProtectedRoute(req) && auth?.sessionClaims?.role.role !== 'admin') {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
    }

    return NextResponse.next();
  },
});

// Use withClerkMiddleware to wrap your middleware function
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'], // Adjust the matcher to your needs
};
