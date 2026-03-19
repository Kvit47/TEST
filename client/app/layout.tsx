import type { Metadata } from "next";
import { Geist, Host_Grotesk, Michroma } from "next/font/google";

import { cn } from "@/lib/utils";
import localFont from 'next/font/local';
import "./globals.css";
import AuthProvider from "@/src/app/providers/auth-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  display: "swap",
});

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
});

export const azonixFont = localFont({
  src: '../public/fonts/azonix/Azonix.otf',
  variable: '--font-azonix',
});


export const metadata: Metadata = {
  title: "SAINT ASLAN",
  description: "SAINT ASLAN",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)
  return (
    <html
      lang="en"
      className={cn(hostGrotesk.variable, azonixFont.variable, michroma.variable, "font-sans", geist.variable)}
    >
      <body className={`${hostGrotesk.className} ${michroma.className} ${azonixFont.variable} antialiased`}>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
