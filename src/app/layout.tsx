import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import {ClerkProvider} from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "CloudSync",
  description: "File Manager",
  icons: {
    icon: "/images/Favicon.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
      <link
            rel="icon"
            href="/images/Logo.png"
            media="(prefers-color-scheme: light)"
          />
          <link
            rel="icon"
            href="/images/Favicon.png"
            media="(prefers-color-scheme: dark)"
          />
          </head>
      <body>{children}</body>
    </html>
    </ClerkProvider>
  );
}
