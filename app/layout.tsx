import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import PageTransition from "@/components/motion/page-transition"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SwapSeva - AI-Powered Barter Platform",
  description: "Exchange goods and services with AI-powered matching and blockchain authentication across India",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " antialiased bg-[radial-gradient(circle_at_20%_20%,hsl(var(--gradient-from)/0.23),transparent_60%),radial-gradient(circle_at_80%_60%,hsl(var(--gradient-to)/0.18),transparent_55%)] relative min-h-screen overflow-x-hidden"}>
        <div className="pointer-events-none fixed inset-0 bg-[url('/noise.svg')] opacity-[0.08] mix-blend-overlay" aria-hidden />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <PageTransition>
            {children}
          </PageTransition>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'