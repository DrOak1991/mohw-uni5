"use client"

import { Suspense, use, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, ClipboardCheck, AlertCircle, Building2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ReviewSimpleNav } from "@/components/review/simple-nav"
import { MultiFileUpload, type UploadedFile } from "@/components/filing/multi-file-upload"
import {
  OUTCOME_REPORT_STAGE_CONFIG,
  PRELIMINARY_REVIEW_CONFIG,
  getOutcomeReportCase,
  getOutcomeReportTypeName,
  getSocietyName,
  type OutcomeReportType,
} from "@/lib/mock/outcome-report"

/**
 * 成果報告審查內容頁（醫事司視角）。
 * 與填報端 /filing/outcome-report/[societyId] 版型相同，差異在職責邊界：
 * 成果報告與醫策會初審意見皆為唯讀，醫事司只能寫自己的審查意見。
 * 審查通過即歸檔，無公告步驟。
 */
function OutcomeReportReviewDetailContent({ societyId }: { societyId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = (searchParams.get("type") as OutcomeReportType) || "quota"

  const reportCase = getOutcomeReportCase(societyId, type)
  const societyName = getSocietyName(societyId)
  const typeName = getOutcomeReportTypeName(type)

  const [mohwComment, setMohwComment] = useState(reportCase?.mohwReviewComment ?? "")
  const [mohwMinutes, setMohwMinutes] = useState<UploadedFile[]>(reportCase?.mohwReviewMinutes ?? [])

  if (!reportCase || reportCase.stage === "待填寫") {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReviewSimpleNav />
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/review/outcome-report"
            className="mb-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            返回成果報告審查
          </Link>
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">
              {reportCase ? "醫策會尚未提送此案件" : "找不到此案件"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isArchived = reportCase.stage === "已歸檔"
  const notYetReviewed = reportCase.preliminaryReview === null
  const pendingSupplement = reportCase.preliminaryReview === "待補件"
  // 醫策會尚未初審或標為待補件者，代表案件尚未準備好交付醫事司裁決
  const canDecide = !isArchived && reportCase.preliminaryReview === "通過"

  const handleUploadMinutes = () =>
    setMohwMinutes((prev) => [
      ...prev,
      { id: `mw-${Date.now()}`, name: `115年度成果報告審查會議紀錄.pdf`, size: "1.6 MB" },
    ])
  const handleRemoveMinutes = (id: string) => setMohwMinutes((prev) => prev.filter((f) => f.id !== id))

  const handleSave = () => toast.success("已儲存審查意見")

  const handleApprove = () => {
    if (!mohwComment.trim()) {
      toast.error("請填寫審查意見")
      return
    }
    toast.success("審查通過，案件已歸檔")
    setTimeout(() => router.push("/review/outcome-report"), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewSimpleNav />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/review/outcome-report"
          className="mb-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          返回成果報告審查
        </Link>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {societyName} - 114年度{typeName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              醫策會上傳日期：{reportCase.uploadedDate ?? "—"}
              {reportCase.archivedDate && `　歸檔日期：${reportCase.archivedDate}`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="outline" className={OUTCOME_REPORT_STAGE_CONFIG[reportCase.stage].color}>
              {OUTCOME_REPORT_STAGE_CONFIG[reportCase.stage].label}
            </Badge>
            {reportCase.preliminaryReview && (
              <Badge variant="outline" className={PRELIMINARY_REVIEW_CONFIG[reportCase.preliminaryReview].color}>
                {PRELIMINARY_REVIEW_CONFIG[reportCase.preliminaryReview].label}
              </Badge>
            )}
          </div>
        </div>

        {isArchived && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-700">
              <ClipboardCheck className="h-5 w-5 shrink-0" />
              <span className="font-medium">本案件已審查通過並歸檔，僅供查看</span>
            </div>
          </div>
        )}

        {notYetReviewed && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start gap-2 text-gray-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
              <div>
                <p className="font-medium">醫策會尚未完成初步審查</p>
                <p className="mt-0.5 text-sm text-gray-500">可先行檢視成果報告，俟初審意見送達後再行裁決。</p>
              </div>
            </div>
          </div>
        )}

        {pendingSupplement && (
          <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-start gap-2 text-orange-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">醫策會初審結果為待補件</p>
                <p className="mt-0.5 text-sm">該學會補件後醫策會將重新上傳，本案尚未備妥供裁決。</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* 成果報告：醫事司僅檢視，不上傳 */}
          <Card>
            <CardHeader>
              <CardTitle>成果報告</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {societyName}提交、由醫策會上傳之 114 年度{typeName}，共 {reportCase.reports.length} 份。
              </p>
              <MultiFileUpload files={reportCase.reports} emptyState="醫策會尚未上傳成果報告" />
            </CardContent>
          </Card>

          {/* 醫策會初審意見：唯讀，作為醫事司裁決的參考 */}
          <Card className="border-slate-200 bg-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-500" />
                醫策會初步審查意見
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-sm font-medium text-gray-700">初審意見</Label>
                <p className="mt-1 whitespace-pre-wrap rounded-lg border bg-white p-3 text-sm text-gray-900">
                  {reportCase.reviewComment || "醫策會尚未填寫初審意見"}
                </p>
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">初審會議紀錄</Label>
                <MultiFileUpload files={reportCase.reviewMinutes} emptyState="無初審會議紀錄" />
              </div>
            </CardContent>
          </Card>

          {/* 醫事司審查意見：本頁唯一可編輯處 */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
                醫事司審查意見
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  審查意見 {!isArchived && <span className="text-destructive">*</span>}
                </Label>
                {isArchived ? (
                  <p className="mt-1 whitespace-pre-wrap rounded-lg border bg-white p-3 text-sm text-gray-900">
                    {mohwComment || "無審查意見"}
                  </p>
                ) : (
                  <Textarea
                    value={mohwComment}
                    onChange={(e) => setMohwComment(e.target.value)}
                    placeholder="請說明審查結果與核定理由..."
                    className="mt-1 min-h-32 bg-white"
                  />
                )}
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">審查會議紀錄</Label>
                <MultiFileUpload
                  files={mohwMinutes}
                  onUpload={isArchived ? undefined : handleUploadMinutes}
                  onRemove={isArchived ? undefined : handleRemoveMinutes}
                  uploadLabel="選擇會議紀錄檔案"
                  emptyState="尚未上傳審查會議紀錄"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/review/outcome-report">返回</Link>
          </Button>
          {!isArchived && (
            <>
              <Button variant="outline" onClick={handleSave}>
                儲存
              </Button>
              <Button
                className="bg-[#2d3a8c] text-white hover:bg-[#252f73]"
                disabled={!canDecide}
                onClick={handleApprove}
              >
                審查通過並歸檔
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OutcomeReportReviewDetailPage({ params }: { params: Promise<{ societyId: string }> }) {
  const { societyId } = use(params)

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <OutcomeReportReviewDetailContent societyId={societyId} />
    </Suspense>
  )
}
