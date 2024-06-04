import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isMatched = createRouteMatcher([])
export default clerkMiddleware((auth, req) => {
    if (isMatched(req)) auth().protect()
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
