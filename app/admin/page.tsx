"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Users,
  FileText,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Shield,
  Building2,
} from "lucide-react"
import Link from "next/link"

const accounts = [
  {
    id: 1,
    name: "內科醫學會",
    email: "admin@internal-medicine.org.tw",
    role: "醫學會",
    status: "active",
    lastLogin: "2025-03-05",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "外科醫學會",
    email: "admin@surgery.org.tw",
    role: "醫學會",
    status: "active",
    lastLogin: "2025-03-04",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    name: "台大醫院",
    email: "training@ntuh.gov.tw",
    role: "訓練醫院",
    status: "active",
    lastLogin: "2025-03-03",
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    name: "榮民總醫院",
    email: "training@vghtpe.gov.tw",
    role: "訓練醫院",
    status: "active",
    lastLogin: "2025-03-02",
    createdAt: "2024-02-01",
  },
  {
    id: 5,
    name: "醫策會承辦",
    email: "reviewer@tjcha.org.tw",
    role: "醫策會",
    status: "active",
    lastLogin: "2025-03-05",
    createdAt: "2024-01-10",
  },
  {
    id: 6,
    name: "新申請帳號",
    email: "new@hospital.org.tw",
    role: "訓練醫院",
    status: "pending",
    lastLogin: null,
    createdAt: "2025-03-04",
  },
]

const announcements = [
  {
    id: 1,
    title: "114年度專科醫師訓練計畫認定基準公告",
    category: "訓練計畫基準",
    status: "published",
    publishDate: "2025-03-01",
    viewCount: 1256,
  },
  {
    id: 2,
    title: "114年度各專科訓練容額分配原則說明",
    category: "容額分配",
    status: "published",
    publishDate: "2025-02-28",
    viewCount: 892,
  },
  {
    id: 3,
    title: "114年度甄審作業時程公告（草稿）",
    category: "甄審原則",
    status: "draft",
    publishDate: null,
    viewCount: 0,
  },
]

const outlineTemplates = [
  {
    id: 1,
    name: "計畫認定基準",
    year: "114",
    sections: 8,
    lastUpdated: "2025-02-15",
    status: "active",
  },
  {
    id: 2,
    name: "訓練課程基準",
    year: "114",
    sections: 12,
    lastUpdated: "2025-02-15",
    status: "active",
  },
  {
    id: 3,
    name: "評核標準",
    year: "114",
    sections: 6,
    lastUpdated: "2025-02-10",
    status: "active",
  },
  {
    id: 4,
    name: "容額分配原則",
    year: "114",
    sections: 5,
    lastUpdated: "2025-02-10",
    status: "active",
  },
  {
    id: 5,
    name: "精進指南",
    year: "114",
    sections: 7,
    lastUpdated: "2025-02-05",
    status: "active",
  },
  {
    id: 6,
    name: "甄審原則",
    year: "114",
    sections: 10,
    lastUpdated: "2025-02-05",
    status: "active",
  },
]

const roleConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline"; icon: typeof Users }
> = {
  醫事司: { label: "醫事司", variant: "default", icon: Shield },
  醫策會: { label: "醫策會", variant: "default", icon: CheckCircle2 },
  醫學會: { label: "醫學會", variant: "secondary", icon: Users },
  訓練醫院: { label: "訓練醫院", variant: "outline", icon: Building2 },
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  active: { label: "啟用", variant: "default" },
  pending: { label: "待審核", variant: "secondary" },
  disabled: { label: "停用", variant: "destructive" },
  published: { label: "已發布", variant: "default" },
  draft: { label: "草稿", variant: "outline" },
  archived: { label: "已下架", variant: "secondary" },
}

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.includes(searchQuery) || account.email.includes(searchQuery)
    const matchesRole = selectedRole === "all" || account.role === selectedRole
    return matchesSearch && matchesRole
  })

  const pendingCount = accounts.filter((a) => a.status === "pending").length

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">管理專區</h1>
        <p className="text-muted-foreground">管理系統帳號、大綱規範與公告設定</p>
      </div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accounts" className="gap-2">
            <Users className="h-4 w-4" />
            帳號管理
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="outlines" className="gap-2">
            <FileText className="h-4 w-4" />
            大綱規範
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Bell className="h-4 w-4" />
            公告管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">總帳號數</p>
                    <p className="text-2xl font-bold">{accounts.length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">醫學會</p>
                    <p className="text-2xl font-bold">
                      {accounts.filter((a) => a.role === "醫學會").length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">訓練醫院</p>
                    <p className="text-2xl font-bold">
                      {accounts.filter((a) => a.role === "訓練醫院").length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-chart-3/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-chart-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">待審核</p>
                    <p className="text-2xl font-bold text-destructive">{pendingCount}</p>
                  </div>
                    <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜尋帳號名稱或 Email..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部角色</SelectItem>
                    <SelectItem value="醫事司">醫事司</SelectItem>
                    <SelectItem value="醫策會">醫策會</SelectItem>
                    <SelectItem value="醫學會">醫學會</SelectItem>
                    <SelectItem value="訓練醫院">訓練醫院</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      新增帳號
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新增帳號</DialogTitle>
                      <DialogDescription>建立新的系統使用者帳號</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>帳號名稱</Label>
                        <Input placeholder="請輸入帳號名稱" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" placeholder="請輸入 Email" />
                      </div>
                      <div className="space-y-2">
                        <Label>角色</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="選擇角色" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="醫學會">醫學會</SelectItem>
                            <SelectItem value="訓練醫院">訓練醫院</SelectItem>
                            <SelectItem value="醫策會">醫策會</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">取消</Button>
                      <Button>建立帳號</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">帳號列表</CardTitle>
              <CardDescription>共 {filteredAccounts.length} 個帳號</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名稱</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>最後登入</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => {
                    const roleInfo = roleConfig[account.role]
                    const statusInfo = statusConfig[account.status]
                    const RoleIcon = roleInfo?.icon || Users
                    return (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>{account.email}</TableCell>
                        <TableCell>
                          <Badge variant={roleInfo?.variant || "outline"} className="gap-1">
                            <RoleIcon className="h-3 w-3" />
                            {account.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </TableCell>
                        <TableCell>{account.lastLogin || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {account.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-accent"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outlines" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">大綱規範管理</h2>
              <p className="text-sm text-muted-foreground">管理各類文件的大綱範本</p>
            </div>
            <Select defaultValue="114">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="選擇年度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="114">114年度</SelectItem>
                <SelectItem value="113">113年度</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {outlineTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="default">{template.year}年度</Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{template.name}</CardTitle>
                  <CardDescription>共 {template.sections} 個章節</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    最後��新：{template.lastUpdated}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/outline-management/${template.id}`} className="flex-1">
                      <Button variant="outline" className="w-full gap-2">
                        <Edit className="h-4 w-4" />
                        編輯
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">公告管理</h2>
              <p className="text-sm text-muted-foreground">管理系統公告與通知</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Clock className="h-4 w-4" />
                待公告案件
                <Badge variant="secondary">3</Badge>
              </Button>
              <Link href="/announcement-management/create">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  新增公告
                </Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>公告標題</TableHead>
                    <TableHead>分類</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>發布日期</TableHead>
                    <TableHead>瀏覽次數</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((announcement) => {
                    const statusInfo = statusConfig[announcement.status]
                    return (
                      <TableRow key={announcement.id}>
                        <TableCell className="font-medium max-w-xs truncate">
                          {announcement.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{announcement.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </TableCell>
                        <TableCell>{announcement.publishDate || "-"}</TableCell>
                        <TableCell>{announcement.viewCount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

