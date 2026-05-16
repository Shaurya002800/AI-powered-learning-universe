import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peblo AI Notes Workspace",
  description: "A collaborative AI notes workspace built for the Peblo full-stack challenge."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
