import { ConvexHttpClient } from "convex/browser";

export function getConvexServerClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  }

  return new ConvexHttpClient(convexUrl);
}
