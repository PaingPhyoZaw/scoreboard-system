"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, ClipboardList, Home, Settings, Users } from "lucide-react"

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
}

export function DashboardNav({ isCollapsed, className, ...props }: NavProps) {
  const pathname = usePathname()

  const items = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Scores",
      href: "/admin/scores",
      icon: BarChart3,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Master Data",
      href: "/admin/master-data",
      icon: ClipboardList,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className={cn("grid items-start gap-2", className)} {...props}>
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent" : "transparent",
              isCollapsed ? "justify-center" : "justify-start",
            )}
          >
            <Icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} />
            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
