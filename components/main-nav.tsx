import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ClipboardCheck } from "lucide-react"
import { UserNav } from "./user-nav"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="flex w-full items-center justify-between">
      <nav className={cn("flex items-center space-x-2", className)} {...props}>
        <Link href="/" className="flex items-center space-x-2 font-semibold">
          <ClipboardCheck className="h-5 w-5" />
          <span>ScoreBoard</span>
        </Link>
      </nav>
      <UserNav />
    </div>
  )
}
