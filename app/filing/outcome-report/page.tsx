"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AQ_OUTCOME_STATUS_CONFIG,
  getAqOutcomeReportCases,
  type OutcomeReportReviewStatus,
} from "@/lib/mock/additional-quota-outcome-report"

/**
 * 外加容額成果報告（醫事司＋醫策會共用的獨立模組）。
 * 適用案件＝分類原則「需成果報告」且已公告的外加容額案件。
 * 兩單位平行審查、各留評論、歸檔；無退回。獨立於外加容額管理，以維持權限邊界。
 */
export default function AdditionalQuotaOutcomeReportPage() {
  const [statusFilter, setStatusFilter] = useState<OutcomeReportReviewStatus | "all">("all")
  const cases = getAqOutcomeReportCases()

  const statusTabs = useMemo(() => {
    const count = (s: OutcomeReportReviewStatus) => cases.filter((c) => c.status === s).length
    return [
      { value: "all" as const, label: "全部", count: cases.length },
      { value: "待審查" as const, label: "待審查", count: count("待審查") },
      { value: "已歸檔" as const, label: "已歸檔", count: count("已歸檔") },
    ]
  }, [cases])

  const rows = useMemo(
    () => (statusFilter === "all" ? cases : cases.filter((c) => c.status === statusFilter)),
    [cases, statusFilter],
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" />
          返回首頁
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">外加容額成果報告</h1>
          <p className="mt-1 text-base text-gray-500">
            訓練醫院於外加容額公告執行滿一年後提交之成果報告，由醫事司與醫策會分工審查、留存歸檔
          </p>
        </div>

        <div className="mb-4 flex items-center gap-6 border-b border-gray-200">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`relative -mb-px flex items-center border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? "border-[#2d3a8c] text-[#2d3a8c]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>訓練醫院</TableHead>
                    <TableHead>分科</TableHead>
                    <TableHead>分類原則</TableHead>
                    <TableHead className="w-32">公告日期</TableHead>
                    <TableHead className="w-28">狀態</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((c) => (
                    <TableRow key={c.applicationId}>
                      <TableCell className="font-medium text-gray-900">{c.hospitalName}</TableCell>
                      <TableCell>{c.specialty}</TableCell>
                      <TableCell className="text-sm text-gray-600">{c.classificationPrinciple}</TableCell>
                      <TableCell className="text-sm text-gray-600">{c.announcementDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={AQ_OUTCOME_STATUS_CONFIG[c.status].color}>
                          {AQ_OUTCOME_STATUS_CONFIG[c.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/filing/outcome-report/${c.applicationId}`}
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            {c.status === "已歸檔" ? "檢視" : "審查"}
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-gray-500">
                        此狀態目前沒有案件
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
