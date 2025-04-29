import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { SideNav } from "@/components/side-nav"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ClipboardCheck } from "lucide-react"
import Link from "next/link"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ScoreBoard Admin",
  description: "Daily performance score tracking system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <Providers>
              <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
