import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora, Geist } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "./convex-client-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Pakistan Trip Planner",
  description: "AI-assisted trip planning platform for curated northern Pakistan travel packages."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body suppressHydrationWarning className={`${sora.variable} ${jakarta.variable}`}>
        <TooltipProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
