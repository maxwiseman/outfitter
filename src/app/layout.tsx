import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "./theme-provider";
import { Footer } from "./footer";
import { TRPCReactProvider } from "@/trpc/react";
import { Separator } from "@/components/ui/separator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Outfitter",
  description: "By Max Wiseman and Ian Steiger",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html className="h-full" lang="en">
      <body className={`h-full font-sans ${inter.className}`}>
        <ThemeProvider>
          <TRPCReactProvider cookies={cookies().toString()}>
            {children}
            <Separator />
            <Footer />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
