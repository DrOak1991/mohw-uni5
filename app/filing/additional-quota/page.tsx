"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, ChevronRight, FileText, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 模擬外加容額申請資料（醫學會視角）
const mockApplications = [
  {
    id: "1",
    hospitalName: "台大醫院",
    year: "115 年度",
    submittedDate: "2026/01/15",
    requestedQuota: 5,
    status: "審查中" as const,
  },
  {
    id: "2",
    hospitalName: "台北榮總",
    year: "115 年度",
    submittedDate: "2026/01/18",
    requestedQuota: 3,
    status: "審查中" as const,
  },
  {
    id: "3",
    hospitalName: "長庚醫院",
    year: "115 年度",
    submittedDate: "2026/01/20",
    requestedQuota: 4,
    status: "已核定" as const,
    approvedQuota: 3,
    approvedDate: "2026/02/15",
  },
  {
    id: "4",
    hospitalName: "馬偕醫院",
    year: "114 年度",
    submittedDate: "2025/01/10",
    requestedQuota: 2,
    status: "已核定" as const,
    approvedQuota: 2,
    approvedDate: "2025/02/20",
  },
]

const statusConfig: Record<string, { color: string; label: string }> = {
  "草稿": { color: "bg-gray-100 text-gray-700 border-gray-200", label: "草稿" },
  "審查中": { color: "bg-blue-100 text-blue-700 border-blue-200", label: "審查中" },
  "已核定": { color: "bg-green-100 text-green-700 border-green-200", label: "已核定" },
  "退回修改": { color: "bg-red-100 text-red-700 border-red-200", label: "退回修改" },
}

export default function FilingAdditionalQuotaPage() {
  const pendingApplications = mockApplications.filter((a) => a.status === "審查中" || a.status === "草稿" || a.status === "退回修改")
  const approvedApplications = mockApplications.filter((a) => a.status === "已核定")

  const renderApplicationCard = (app: (typeof mockApplications)[0]) => (
    <Card key={app.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{app.hospitalName}</h3>
              <Badge variant="outline" className="text-xs">
                {app.year}
              </Badge>
              <Badge variant="outline" className={statusConfig[app.status].color}>
                {statusConfig[app.status].label}
              </Badge>
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
              {app.status === "已核定" && (
                <>
                  <div>
                    <span className="font-medium">核定容額：</span>
                    <span className="text-green-600 font-semibold">{(app as any).approvedQuota} 名</span>
                  </div>
                  <div>
                    <span className="font-medium">核定日期：</span>
                    {(app as any).approvedDate}
                  </div>
                </>
              )}
            </div>
          </div>

          <Button variant="outline" asChild>
            <Link href={`/filing/additional-quota/${app.id}`} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {app.status === "草稿" || app.status === "退回修改" ? "編輯申請" : "檢視詳情"}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/filing"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          返回填報專區
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">外加容額申請</h1>
            <p className="text-sm text-gray-500 mt-1">管理訓練醫院的外加容額申請</p>
          </div>

          <Button className="gap-2 bg-[#2d3a8c] hover:bg-[#252f73]">
            <Plus className="w-4 h-4" />
            新增申請
          </Button>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              進行中
              <Badge variant="secondary" className="ml-1">
                {pendingApplications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              已核定
              <Badge variant="secondary" className="ml-1">
                {approvedApplications.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3">
            {pendingApplications.length > 0 ? (
              pendingApplications.map(renderApplicationCard)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">目前沒有進行中的申請</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-3">
            {approvedApplications.length > 0 ? (
              approvedApplications.map(renderApplicationCard)
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">目前沒有已核定的申請</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
