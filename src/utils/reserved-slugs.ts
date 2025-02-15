// Add all application routes here to prevent them from being used as slugs
export const RESERVED_SLUGS = new Set([
  // App routes
  "api",
  "auth",
  "login",
  "signup",
  "dashboard",
  "profile",
  "settings",
  "404",
  // API routes
  "trpc",
  // Special routes
  "favicon.ico",
]);

export const isReservedSlug = (slug: string) =>
  RESERVED_SLUGS.has(slug.toLowerCase());
