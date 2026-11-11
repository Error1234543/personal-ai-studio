import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal AI Studio",
  description: "Your private workspace for AI chat, coding and deployment."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}