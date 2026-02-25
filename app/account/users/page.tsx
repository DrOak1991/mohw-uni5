"use client"

import { useState } from "react"
import { SimpleNav } from "@/components/account/simple-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, UserPlus, Edit, Power, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddUserDialog } from "@/components/account/add-user-dialog"

// 模擬使用者資料
const users = [
  {
    id: "1",
    name: "王小明",
    email: "wang.xiaoming@example.com",
    role: "一般使用者",
    status: "active",
    lastLogin: "2025/10/16 09:30",
  },
  {
    id: "2",
    name: "李小華",
    email: "li.xiaohua@example.com",
    role: "審查委員",
    status: "active",
    lastLogin: "2025/10/15 14:20",
  },
  {
    id: "3",
    name: "張大明",
    email: "zhang.daming@example.com",
    role: "管理者",
    status: "active",
    lastLogin: "2025/10/16 08:15",
  },
  {
    id: "4",
    name: "陳小芳",
    email: "chen.xiaofang@example.com",
    role: "編輯者",
    status: "inactive",
    lastLogin: "2025/09/28 16:45",
  },
  {
    id: "5",
    name: "林志明",
    email: "lin.zhiming@example.com",
    role: "審查委員",
    status: "active",
    lastLogin: "2025/10/14 11:30",
  },
]

export default function UsersManagementPage() {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-muted/30">
      <SimpleNav />

      <div className="container mx-auto px-4 py-8">
        {/* 頁面標題 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">使用者管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理系統使用者帳號與權限設定</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>使用者列表</CardTitle>
                <CardDescription>共 {users.length} 位使用者</CardDescription>
              </div>
              <Button onClick={() => setAddUserDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                新增使用者
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* 搜尋與篩選 */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="搜尋姓名或帳號..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="角色篩選" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部角色</SelectItem>
                  <SelectItem value="admin">管理者</SelectItem>
                  <SelectItem value="reviewer">審查委員</SelectItem>
                  <SelectItem value="editor">編輯者</SelectItem>
                  <SelectItem value="user">一般使用者</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="狀態篩選" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部狀態</SelectItem>
                  <SelectItem value="active">啟用中</SelectItem>
                  <SelectItem value="inactive">已停用</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 使用者表格 */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>帳號</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>最後登入</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.status === "active" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            啟用中
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            已停用
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/account/users/${user.id}`} className="flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                編輯權限
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Power className="h-4 w-4 mr-2" />
                              {user.status === "active" ? "停用帳號" : "啟用帳號"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 分頁 */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                顯示 1-{users.length} 筆，共 {users.length} 筆
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  上一頁
                </Button>
                <Button variant="outline" size="sm" disabled>
                  下一頁
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddUserDialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen} />
    </div>
  )
}
