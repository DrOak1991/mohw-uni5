"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Users, Settings } from "lucide-react"

const navItems = [
  {
    title: "個人設定",
    href: "/account/personal",
    icon: User,
  },
  {
    title: "使用者管理",
    href: "/account/users",
    icon: Users,
    requiresAdmin: true,
  },
]

export function SimpleNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 py-4">
            <Settings className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">帳號管理</span>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors border-b-2",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
