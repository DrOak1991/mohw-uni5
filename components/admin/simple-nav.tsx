"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Megaphone } from "lucide-react"

export function AdminNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin/pending", label: "待發佈管理" },
    { href: "/admin/published", label: "已發佈管理" },
  ]

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Megaphone className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">後台機能</span>
          </div>
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
