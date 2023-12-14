"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { api } from "@/trpc/react";

export default function Page(): React.ReactElement {
  // const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const coordsFetcher = api.openWeatherMap.getByCoords.useQuery(
    location
      ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      : undefined,
    { refetchOnWindowFocus: false },
  );
  const textFetcher = api.openWeatherMap.getByText.useQuery(searchQuery, {
    refetchOnWindowFocus: false,
  });

  const formSchema = z.object({
    location: z.string().max(50),
    useCurrentLocation: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      useCurrentLocation: false,
    },
  });

  function getLocationByIp(): void {
    fetch("/api/location")
      .then((res) => res.json())
      .then((res: GeolocationCoordinates) => {
        setLocation({
          coords: {
            latitude: res.latitude || 0,
            longitude: res.longitude || 0,
            accuracy: res.accuracy || 0,
            altitude: res.altitude || 0,
            altitudeAccuracy: res.altitudeAccuracy || 0,
            heading: res.heading || 0,
            speed: res.speed || 0,
          },
          timestamp: 0,
        });
      })
      .catch(() => {
        console.error("Error fetching location by IP");
      });
  }

  function onSubmit(values: z.infer<typeof formSchema>): void {
    setLoading(true);
    if (values.useCurrentLocation) {
      if (!location)
        navigator.geolocation.getCurrentPosition(
          (newLocation) => {
            setLocation(newLocation);
          },
          // TODO: This shouldn't really be null, we should probably throw a toast or something on the screen
          getLocationByIp,
          { enableHighAccuracy: false, maximumAge: Infinity, timeout: 5000 },
        );
    } else {
      setSearchQuery(values.location);
    }
  }

  useEffect(() => {
    if (!coordsFetcher.isLoading && !textFetcher.isLoading) {
      setLoading(false);
    }
  }, [textFetcher.isLoading, coordsFetcher.isLoading]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <Card className="h-max w-3/4">
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
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="New York City"
                        {...field}
                        disabled={form.getValues().useCurrentLocation}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="useCurrentLocation"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Use Current Location</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" loading={loading} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
