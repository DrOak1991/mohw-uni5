"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Home, Users, Megaphone, ClipboardCheck } from "lucide-react"
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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">醫</span>
              </div>
              <span>醫事司五科</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  首頁
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isActive("/account") ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Users className="w-4 h-4" />
                    帳號管理
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/account/personal" className="cursor-pointer">
                      個人設定
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/users" className="cursor-pointer">
                      使用者管理列表
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/role-templates" className="cursor-pointer">
                      角色模板管理
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
                  <DropdownMenuItem asChild>
                    <Link href="/review/outline-management" className="cursor-pointer">
                      填報文件大綱
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isActive("/admin") ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Megaphone className="w-4 h-4" />
                    後台機能
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/pending" className="cursor-pointer">
                      待發佈管理
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/published" className="cursor-pointer">
                      已發佈管理
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="text-sm text-gray-500">暫時性導覽</div>
        </div>
      </div>
    </nav>
  )
}
