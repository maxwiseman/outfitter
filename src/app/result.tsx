import { type WeatherAPIResponse } from "@/server/api/routers/openweathermap";

export default function Result({
  weather,
}: {
  weather?: WeatherAPIResponse;
}): React.ReactElement {
  if (!weather) {
    return <>Nothing yet!</>;
  } else if (weather.main.temp <= 36)
    return <div>Its freezing, wear something warm</div>;
  else if (weather.main.temp <= 55)
    return <div>Its a little cold, wear a sweater or something</div>;
  else if (weather.main.temp <= 100)
    return <div>Its not that cold, you'll be fine with short sleeves</div>;
  return <>Nothing yet!</>;
}
