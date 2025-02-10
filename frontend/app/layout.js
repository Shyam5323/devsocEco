import localFont from "next/font/local";
import QueryProvider from "@/app/(ROOT)/bestpractices/QueryProvider";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const workSans = localFont({
  src: [
    { path: "./fonts/WorkSans-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/WorkSans-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/WorkSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/WorkSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/WorkSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/WorkSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/WorkSans-Thin.ttf", weight: "300", style: "normal" },
    { path: "./fonts/WorkSans-Light.ttf", weight: "200", style: "normal" },
    { path: "./fonts/WorkSans-ExtraLight.ttf", weight: "100", style: "normal" },
  ],
  variable: "--font-work-sans",
});

export const metadata = {
  title: "EcoTrackr",
  description:
    "Track your carbon footprint and offset it for a sustainable future.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={workSans.variable}>
          <QueryProvider>
            {children}
          </QueryProvider>
      </body>
    </html>
  );
}
