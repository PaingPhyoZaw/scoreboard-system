"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, ClipboardList, Home, Settings, Users } from "lucide-react"

interface SideNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SideNav({ className, ...props }: SideNavProps) {
  const pathname = usePathname()

  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Scores",
      href: "/scores",
      icon: BarChart3,
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
    },
    {
      title: "Master Data",
      href: "/master-data",
      icon: ClipboardList,
    },
    // {
    //   title: "Settings",
    //   href: "/settings",
    //   icon: Settings,
    // },
  ]

  return (
    <aside className={cn("w-64 border-r bg-background", className)} {...props}>
      <nav className="grid items-start px-2 py-4">
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent/50" : "transparent",
              )}
            >
              <Icon className={cn("mr-3 h-4 w-4")} />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
