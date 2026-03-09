import type React from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const GlobalNav = dynamic(() => import("@/components/global-nav").then(mod => mod.GlobalNav), {
  ssr: false,
})
import { Toaster } from "sonner"
import { Noto_Sans_TC, Geist_Mono } from "next/font/google"

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "專科醫師訓練管理系統",
  description: "醫事人力管理效能提升及數位應用推動計畫",
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${notoSansTC.variable} font-sans antialiased`}>
        <GlobalNav />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
