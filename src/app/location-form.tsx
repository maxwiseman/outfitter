"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { type WeatherAPIResponse } from "@/server/api/routers/openweathermap";

export default function LocationForm({
  onLocationChange,
  onWeatherChange,
  onError,
}: {
  onLocationChange?: (arg0: GeolocationPosition | undefined) => void;
  onWeatherChange?: (arg0: WeatherAPIResponse | undefined) => void;
  onError?: () => void;
}): React.ReactElement {
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
      .then(
        (res: {
          latitude: string;
          longitude: string;
          accuracy: string;
          altitude: string;
          altitudeAccuracy: string;
          heading: string;
          speed: string;
        }) => {
          setLocation({
            coords: {
              latitude: parseInt(res.latitude) || 0,
              longitude: parseInt(res.longitude) || 0,
              accuracy: parseInt(res.accuracy) || 0,
              altitude: parseInt(res.altitude) || 0,
              altitudeAccuracy: parseInt(res.altitudeAccuracy) || 0,
              heading: parseInt(res.heading) || 0,
              speed: parseInt(res.speed) || 0,
            },
            timestamp: 0,
          });
        },
      )
      .catch(() => {
        console.error("Error fetching location by IP");
      });
  }

  function onSubmit(values: z.infer<typeof formSchema>): void {
    setLoading(true);
    if (values.useCurrentLocation) {
      if (!location)
        // setTimeout(() => {
        //   if (loading) {
        //     console.error(
        //       "Failed to fetch location in time. Falling back to IP based location.",
        //     );
        //     getLocationByIp();
        //   }
        // }, 5000);
        navigator.geolocation.getCurrentPosition(
          (newLocation) => {
            setLocation(newLocation);
          },
          () => {
            console.error(
              "Failed to fetch location in time. Falling back to IP based location.",
            );
            getLocationByIp();
          },
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

  useEffect(() => {
    if (onLocationChange) onLocationChange(location);
  }, [location, onLocationChange]);

  useEffect(() => {
    if (
      onWeatherChange &&
      textFetcher.data !== "No input!" &&
      textFetcher.data?.cod === 200
    ) {
      onWeatherChange(textFetcher.data);
    } else if (onError) onError();
  }, [onError, onWeatherChange, textFetcher.data]);
  useEffect(() => {
    if (
      onWeatherChange &&
      coordsFetcher.data !== "No input!" &&
      coordsFetcher.data?.cod === 200
    ) {
      onWeatherChange(coordsFetcher.data);
    } else if (onError) onError();
  }, [onWeatherChange, coordsFetcher.data, onError]);

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
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
  );
}
