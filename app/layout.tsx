import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const imageUrl = `${origin}/og.png`;

  return {
    title: "CogniThread | Synchronized cognitive rehabilitation",
    description:
      "A research prototype synchronizing wearable EEG with therapist-recorded behaviour for cognitive rehabilitation.",
    openGraph: {
      title: "CogniThread | Signals in context",
      description:
        "Wearable EEG and real-time behavioural assessment on one synchronized timeline.",
      type: "website",
      url: origin,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "CogniThread synchronized rehabilitation signals" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "CogniThread | Signals in context",
      description:
        "Wearable EEG and real-time behavioural assessment on one synchronized timeline.",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
