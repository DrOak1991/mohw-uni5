"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Pencil, Clock, Power } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FilingScheduleDialog } from "@/components/admin/filing-schedule-dialog"
import { filingItemsConfig } from "@/lib/mock/review-outline"
import type { FilingItemConfig } from "@/lib/mock/review-outline"

export default function FilingItemManagementPage() {
  const [selectedItem, setSelectedItem] = useState<FilingItemConfig | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const getStatusBadge = (item: FilingItemConfig) => {
    switch (item.status) {
      case "open":
        return <Badge className="bg-green-100 text-green-800">開放中</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">未開放</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">排程中</Badge>
    }
  }

  const getFilingPeriod = (item: FilingItemConfig) => {
    if (!item.openingDate) return "尚未設定"
    const startDate = item.openingDate.split(" ")[0]
    const endDate = item.closingDate?.split(" ")[0]
    return `${startDate} ~ ${endDate}`
  }

  const handleScheduleClick = (item: FilingItemConfig) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">填報項目管理</h1>
          <p className="text-sm text-gray-600 mt-1">設定各項填報文件的開放時間和狀態</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_2fr_auto_auto] items-center px-6 py-3 border-b border-gray-200 bg-gray-50">
            <span className="text-xs font-semibold text-gray-500 uppercase">文件名稱</span>
            <span className="text-xs font-semibold text-gray-500 uppercase">狀態</span>
            <span className="text-xs font-semibold text-gray-500 uppercase">填報期間</span>
            <span className="text-xs font-semibold text-gray-500 uppercase">操作</span>
            <span className="text-xs font-semibold text-gray-500 uppercase">大綱</span>
          </div>

          <div className="divide-y divide-gray-200">
            {filingItemsConfig.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[2fr_1fr_2fr_auto_auto] items-center px-6 py-4 hover:bg-gray-50"
              >
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                </div>

                <div>{getStatusBadge(item)}</div>

                <div className="text-xs text-gray-600">{getFilingPeriod(item)}</div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 h-8 px-2"
                    onClick={() => handleScheduleClick(item)}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">排程</span>
                  </Button>
                  {item.status === "open" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span className="text-xs">關閉</span>
                    </Button>
                  )}
                </div>

                <Button asChild size="sm" variant="outline" className="gap-1 h-8">
                  <Link href={`/admin/outline-management/${item.id}`}>
                    <Pencil className="w-3.5 h-3.5" />
                    <span className="text-xs">編輯</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <FilingScheduleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          item={selectedItem}
        />
      )}
    </div>
  )
}
