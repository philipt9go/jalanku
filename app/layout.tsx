import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { DM_Sans, DM_Mono } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "JalanKu — Commute Cost Calculator Malaysia",
  description:
    "Find out your real monthly commute cost — fuel, toll, and parking — vs taking Rapid KL transit. Free calculator covering 50 KL routes.",
  openGraph: {
    title: "JalanKu — How much does your commute really cost?",
    description:
      "Kepong → KLCC costs RM 396/month by car. Transit: RM 228. Calculate yours free.",
    type: "website",
    locale: "en_MY",
  },
  keywords: ["commute calculator", "Malaysia", "KL", "LRT", "MRT", "toll", "parking", "Rapid KL"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
        <body className="bg-stone-50 text-gray-900 antialiased min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
