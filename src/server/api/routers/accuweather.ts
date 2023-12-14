import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";

export const accuWeatherRouter = createTRPCRouter({
  getByCoords: publicProcedure
    .input(z.object({ latitude: z.number(), longitude: z.number() }).optional())
    .query(async ({ input }) => {
      if (input) {
        const locationData = await fetch(
          `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${env.ACCUWEATHER_API_KEY}&q=${input.latitude},${input.longitude}`,
        ).then((res) => res.json() as unknown as LocationAPIResponse);
        if (!locationData[0]) {
          console.error("Couldn't retreive location data!", locationData);
          return "Error fetching location data!";
        }
        const weatherData = await fetch(
          `http://dataservice.accuweather.com/currentconditions/v1/${locationData[0].Key}?apikey=${env.ACCUWEATHER_API_KEY}`,
        ).then((res) => res.json() as unknown as WeatherAPIResponse);
        return { location: locationData, weather: weatherData };
      }
      return "No input!";
    }),
  getByText: publicProcedure
    .input(z.string().optional())
    .query(async ({ input }) => {
      if (input) {
        const locationData = await fetch(
          `http://dataservice.accuweather.com/locations/v1/search?apikey=${env.ACCUWEATHER_API_KEY}&q=${input}`,
        ).then((res) => res.json() as unknown as LocationAPIResponse);
        if (!locationData[0]) {
          return "Error fetching location data!";
        }
        const weatherData = await fetch(
          `http://dataservice.accuweather.com/currentconditions/v1/${locationData[0].Key}?apikey=${env.ACCUWEATHER_API_KEY}`,
        ).then((res) => res.json() as unknown as WeatherAPIResponse);
        return { location: locationData, weather: weatherData };
      }
      return "No input!";
    }),
});

interface Elevation {
  Value: number;
  Unit: string;
  UnitType: number;
}

interface GeoPosition {
  Latitude: number;
  Longitude: number;
  Elevation: {
    Metric: Elevation;
    Imperial: Elevation;
  };
}

interface TimeZone {
  Code: string;
  Name: string;
  GmtOffset: number;
  IsDaylightSaving: boolean;
  NextOffsetChange: string;
}

interface Area {
  ID: string;
  LocalizedName: string;
  EnglishName: string;
  Level?: number;
  LocalizedType?: string;
  EnglishType?: string;
  CountryID?: string;
}

interface SupplementalAdminArea {
  Level: number;
  LocalizedName: string;
  EnglishName: string;
}

interface City {
  Version: number;
  Key: string;
  Type: string;
  Rank: number;
  LocalizedName: string;
  EnglishName: string;
  PrimaryPostalCode: string;
  Region: Area;
  Country: Area;
  AdministrativeArea: Area;
  TimeZone: TimeZone;
  GeoPosition: GeoPosition;
  IsAlias: boolean;
  SupplementalAdminAreas: SupplementalAdminArea[];
  DataSets: string[];
}

type LocationAPIResponse = City[];

interface Temperature {
  Value: number;
  Unit: string;
  UnitType: number;
  Phrase?: string;
}

interface Direction {
  Degrees: number;
  Localized: string;
  English: string;
}

interface Speed {
  Metric: Temperature;
  Imperial: Temperature;
}

interface PressureTendency {
  LocalizedText: string;
  Code: string;
}

interface Range {
  Minimum: Temperature;
  Maximum: Temperature;
}

interface TemperatureSummary {
  Past6HourRange: Range;
  Past12HourRange: Range;
  Past24HourRange: Range;
}

interface WeatherResponse {
  LocalObservationDateTime: string;
  EpochTime: number;
  WeatherText: string;
  WeatherIcon: number;
  HasPrecipitation: boolean;
  PrecipitationType: null | string;
  IsDayTime: boolean;
  Temperature: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  RealFeelTemperature: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  RealFeelTemperatureShade: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  RelativeHumidity: number;
  IndoorRelativeHumidity: number;
  DewPoint: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  Wind: {
    Direction: Direction;
    Speed: Speed;
  };
  WindGust: {
    Speed: Speed;
  };
  UVIndex: number;
  UVIndexText: string;
  Visibility: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  ObstructionsToVisibility: string;
  CloudCover: number;
  Ceiling: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  Pressure: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  PressureTendency: PressureTendency;
  Past24HourTemperatureDeparture: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  ApparentTemperature: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  WindChillTemperature: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  WetBulbTemperature: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  Precip1hr: {
    Metric: Temperature;
    Imperial: Temperature;
  };
  PrecipitationSummary: {
    Precipitation: {
      Metric: Temperature;
      Imperial: Temperature;
    };
    PastHour: {
      Metric: Temperature;
      Imperial: Temperature;
    };
    Past3Hours: {
      Metric: Temperature;
      Imperial: Temperature;
    };
    Past6Hours: {
      Metric: Temperature;
      Imperial: Temperature;
    };
    Past9Hours: {
      Metric: Temperature;
      Imperial: Temperature;
    };
    Past12Hours: {
      Metric: Temperature;
      Imperial: Temperature;
    };
    Past18Hours: {
      Metric: Temperature;
      Imperial: Temperature;
    };
    Past24Hours: {
      Metric: Temperature;
      Imperial: Temperature;
    };
  };
  TemperatureSummary: TemperatureSummary;
  MobileLink: string;
  Link: string;
}

type WeatherAPIResponse = WeatherResponse[];
