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
      <body>{children}</body>
    </html>
    </ClerkProvider>
  );
}
