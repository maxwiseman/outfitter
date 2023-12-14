import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";

export const openWeatherMapRouter = createTRPCRouter({
  getByCoords: publicProcedure
    .input(z.object({ latitude: z.number(), longitude: z.number() }).optional())
    .query(async ({ input }) => {
      if (input) {
        const weatherData = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${input.latitude}&lon=${input.longitude}&appid=${env.OPENWEATHERMAP_API_KEY}`,
        ).then((res) => res.json() as unknown as WeatherAPIResponse);
        return weatherData;
      }
      return "No input!";
    }),
  getByText: publicProcedure
    .input(z.string().optional())
    .query(async ({ input }) => {
      if (input) {
        const weatherData = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${env.OPENWEATHERMAP_API_KEY}`,
        ).then((res) => res.json() as unknown as WeatherAPIResponse);
        return weatherData;
      }
      return "No input!";
    }),
});

interface WeatherAPIResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
