import { Card, CardContent } from "@/components/ui/card";

export default function Page(): React.ReactElement {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <Card className="h-3/4 w-3/4">
        <CardContent>Hello</CardContent>
      </Card>
    </main>
  );
}
