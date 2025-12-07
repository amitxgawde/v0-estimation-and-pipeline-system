import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const giftFavicon =
  "/gift-icon.svg"

export const metadata: Metadata = {
  title: "AGSoft - Estimation & Pipeline Management",
  description: "Streamline your estimates, pipeline, and finances in one place",
  generator: "v0.app",
  icons: {
    icon: [{ url: giftFavicon }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
