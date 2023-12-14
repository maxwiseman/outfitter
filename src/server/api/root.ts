import { accuWeatherRouter } from "./routers/accuweather";
import { openWeatherMapRouter } from "./routers/openweathermap";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // post: postRouter,
  accuWeather: accuWeatherRouter,
  openWeatherMap: openWeatherMapRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
