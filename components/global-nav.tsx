"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  ChevronDown,
  Home,
  ClipboardCheck,
  FileText,
  Bell,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function GlobalNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">醫</span>
              </div>
              <span className="hidden sm:inline">專科醫師訓練管理系統</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  首頁
                </Link>
              </Button>

              <Button
                variant={isActive("/announcements") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link href="/announcements" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  公告欄
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isActive("/filing") ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    填報專區
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/filing" className="cursor-pointer">
                      文件填報
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/filing?tab=quota" className="cursor-pointer">
                      容額填報
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/filing/additional-quota" className="cursor-pointer">
                      外加容額申請
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isActive("/review") ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    審查專區
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/review/submissions" className="cursor-pointer">
                      填報審查
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/review/hospital-quota" className="cursor-pointer">
                      醫院容額分配審查
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/review/additional-quota" className="cursor-pointer">
                      外加容額審查
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isActive("/admin/outline-management") || isActive("/account") || isActive("/announcement-management") ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Settings className="w-4 h-4" />
                    管理專區
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/outline-management" className="cursor-pointer">
                      大綱規範管理
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/users" className="cursor-pointer">
                      使用者管理
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/role-templates" className="cursor-pointer">
                      角色模板管理
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/announcement-management" className="cursor-pointer">
                      公告管理
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/personal" className="cursor-pointer">
                      個人設定
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="text-sm text-gray-500 hidden sm:block">衛生福利部醫事司 · 專科醫師訓練管理</div>
        </div>
      </div>
    </nav>
  )
}
