import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { ApplicationStatusProvider } from "@/context/application-status-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MYTH Crew",
  description: "Official website for the MYTH Crew",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ApplicationStatusProvider>
            <Navbar />
            {children}
          </ApplicationStatusProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
