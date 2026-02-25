"use client"

import { useState } from "react"
import { ReviewSimpleNav } from "@/components/review/simple-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockApplications = [
  {
    id: "1",
    hospitalName: "台大醫院",
    year: "115 年度",
    submittedDate: "2025-01-15",
    requestedQuota: 5,
    status: "待審查" as const,
  },
  {
    id: "2",
    hospitalName: "台北榮總",
    year: "115 年度",
    submittedDate: "2025-01-18",
    requestedQuota: 3,
    status: "待審查" as const,
  },
  {
    id: "3",
    hospitalName: "長庚醫院",
    year: "115 年度",
    submittedDate: "2025-01-20",
    requestedQuota: 4,
    status: "待公告" as const,
    reviewedDate: "2025-01-25 14:30",
  },
  {
    id: "4",
    hospitalName: "馬偕醫院",
    year: "115 年度",
    submittedDate: "2025-01-10",
    requestedQuota: 2,
    status: "已公告" as const,
    reviewedDate: "2025-01-22 10:15",
    announcedDate: "2025-01-28",
  },
  {
    id: "5",
    hospitalName: "中國醫藥大學附設醫院",
    year: "115 年度",
    submittedDate: "2025-01-12",
    requestedQuota: 3,
    status: "已公告" as const,
    reviewedDate: "2025-01-23 16:45",
    announcedDate: "2025-01-29",
  },
]

const statusConfig = {
  待審查: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "待審查" },
  待公告: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "待公告" },
  已公告: { color: "bg-green-100 text-green-800 border-green-200", label: "已公告" },
}

export default function AdditionalQuotaReviewPage() {
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch = app.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingReviewApplications = filteredApplications.filter((a) => a.status === "待審查")
  const pendingAnnouncementApplications = filteredApplications.filter((a) => a.status === "待公告")
  const announcedApplications = filteredApplications.filter((a) => a.status === "已公告")

  const renderApplicationCard = (app: (typeof mockApplications)[0]) => (
    <Card key={app.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{app.hospitalName}</h3>
              <Badge variant="outline" className="text-xs">
                {app.year}
              </Badge>
              <Badge className={statusConfig[app.status].color}>{statusConfig[app.status].label}</Badge>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div>
                <span className="font-medium">送件日期：</span>
                {app.submittedDate}
              </div>
              <div>
                <span className="font-medium">申請容額：</span>
                {app.requestedQuota} 名
              </div>
              {app.reviewedDate && (
                <div>
                  <span className="font-medium">審查時間：</span>
                  {app.reviewedDate}
                </div>
              )}
              {app.status === "已公告" && (app as any).announcedDate && (
                <div>
                  <span className="font-medium">公告日期：</span>
                  {(app as any).announcedDate}
                </div>
              )}
            </div>
          </div>

          <Button asChild>
            <Link href={`/review/additional-quota/${app.id}`} className="flex items-center gap-2">
              {app.status === "待審查" ? "檢視審查" : app.status === "待公告" ? "公告作業" : "檢視詳情"}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewSimpleNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">外加容額審查</h1>
            <p className="text-sm text-gray-500 mt-1">審查各醫院提交的外加容額申請</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchExpanded(!searchExpanded)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {searchExpanded && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="搜尋醫院名稱..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="審查狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部狀態</SelectItem>
                    <SelectItem value="待審查">待審查</SelectItem>
                    <SelectItem value="待公告">待公告</SelectItem>
                    <SelectItem value="已公告">已公告</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-500 ml-auto">共 {filteredApplications.length} 個申請</div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="pending-review" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending-review" className="flex items-center gap-2">
              待審查
              <Badge variant="secondary" className="ml-1">
                {pendingReviewApplications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending-announcement" className="flex items-center gap-2">
              待公告
              <Badge variant="secondary" className="ml-1">
                {pendingAnnouncementApplications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="announced" className="flex items-center gap-2">
              已公告
              <Badge variant="secondary" className="ml-1">
                {announcedApplications.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending-review" className="space-y-3">
            {pendingReviewApplications.length > 0 ? (
              pendingReviewApplications.map(renderApplicationCard)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">目前沒有待審查的申請</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending-announcement" className="space-y-3">
            {pendingAnnouncementApplications.length > 0 ? (
              pendingAnnouncementApplications.map(renderApplicationCard)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">目前沒有待公告的申請</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="announced" className="space-y-3">
            {announcedApplications.length > 0 ? (
              announcedApplications.map(renderApplicationCard)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">目前沒有已公告的申請</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
