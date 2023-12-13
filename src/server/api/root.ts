import { weatherRouter } from "./routers/accuweather";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // post: postRouter,
  weather: weatherRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
