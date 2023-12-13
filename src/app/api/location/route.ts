import { geolocation } from "@vercel/edge";

export const runtime = "edge";

export function GET(request: Request): Response {
  const location = geolocation(request);
  // You can also get the city using dot notation on the function
  // const city = geolocation(request).city;
  return new Response(JSON.stringify(location), {
    headers: { "content-type": "application/json" },
  });
}
