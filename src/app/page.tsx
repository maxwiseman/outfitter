"use client";

import { useState } from "react";
import LocationForm from "./location-form";
import Result from "./result";
import { Card, CardContent } from "@/components/ui/card";
import { type WeatherAPIResponse } from "@/server/api/routers/openweathermap";

export default function Page(): React.ReactElement {
  const [location, setLocation] = useState<GeolocationPosition | undefined>();
  const [weather, setWeather] = useState<WeatherAPIResponse>();

  return (
    <main className="flex h-full w-full items-center justify-center">
      <div className="m-auto flex h-max w-3/4 flex-wrap items-center justify-center gap-4">
        <Card className="min-w-[24rem] grow">
          <CardContent className="p-6">
            {/* <Command className="relative overflow-visible">
              <CommandInput
                onFocus={() => {
                  setOpen(!open);
                }}
              />
              <Card
                className={cn(
                  "absolute top-full mt-2 w-full overflow-hidden rounded-md transition-[height] animate-in",
                  open ? "h-max" : "h-0",
                )}
              >
                <CommandList className="my-2 space-y-2">
                  <CommandItem className="mx-2">Thing 1</CommandItem>
                  <CommandItem className="mx-2">Thing 2</CommandItem>
                  <CommandItem className="mx-2">Thing 3</CommandItem>
                </CommandList>
              </Card>
            </Command> */}
            <LocationForm
              onLocationChange={setLocation}
              onWeatherChange={setWeather}
            />
          </CardContent>
        </Card>
        <Card className="bottom-0 top-0 block h-full w-56">
          <CardContent className="p-6">
            <Result weather={weather} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
