"use client"

import { Suspense, use, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, ClipboardCheck, AlertCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MultiFileUpload, type UploadedFile } from "@/components/filing/multi-file-upload"
import {
  OUTCOME_REPORT_STAGE_CONFIG,
  PRELIMINARY_REVIEW_CONFIG,
  getOutcomeReportCase,
  getOutcomeReportTypeName,
  getSocietyName,
  type OutcomeReportType,
  type PreliminaryReviewResult,
} from "@/lib/mock/outcome-report"

/**
 * 成果報告內容頁（醫策會視角）。
 * 上傳與初步審查同屬醫策會的職責，因此本頁是填報與審查的 hybrid：
 * 上半為上傳區，下半為初審區，以底色區隔。
 * 與文件填報的上傳版型相比，成果報告份數不定、無修正對照表、不需文件檢視預覽。
 */
function OutcomeReportDetailContent({ societyId }: { societyId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = (searchParams.get("type") as OutcomeReportType) || "quota"

  const reportCase = getOutcomeReportCase(societyId, type)
  const societyName = getSocietyName(societyId)
  const typeName = getOutcomeReportTypeName(type)

  const [reports, setReports] = useState<UploadedFile[]>(reportCase?.reports ?? [])
  const [reviewComment, setReviewComment] = useState(reportCase?.reviewComment ?? "")
  const [reviewMinutes, setReviewMinutes] = useState<UploadedFile[]>(reportCase?.reviewMinutes ?? [])
  const [result, setResult] = useState<PreliminaryReviewResult | null>(reportCase?.preliminaryReview ?? null)

  if (!reportCase) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/filing/outcome-report"
            className="mb-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            返回成果報告上傳
          </Link>
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">找不到此案件</p>
          </div>
        </div>
      </div>
    )
  }

  // 已歸檔代表醫事司已審查通過，全頁唯讀
  const isArchived = reportCase.stage === "已歸檔"
  const hasReports = reports.length > 0

  const handleUploadReport = () =>
    setReports((prev) => [
      ...prev,
      { id: `r-${Date.now()}`, name: `${societyName}_114年度${typeName}_附件${prev.length + 1}.pdf`, size: "2.4 MB" },
    ])
  const handleRemoveReport = (id: string) => setReports((prev) => prev.filter((f) => f.id !== id))

  const handleUploadMinutes = () =>
    setReviewMinutes((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, name: `115年度成果報告初審會議紀錄.pdf`, size: "1.4 MB" },
    ])
  const handleRemoveMinutes = (id: string) => setReviewMinutes((prev) => prev.filter((f) => f.id !== id))

  const handleSaveUpload = () => toast.success("已儲存上傳內容")

  const handleSubmitReview = (decision: PreliminaryReviewResult) => {
    if (!reviewComment.trim()) {
      toast.error("請填寫初審意見")
      return
    }
    setResult(decision)
    if (decision === "通過") {
      toast.success("初審通過，已提送醫事司審查")
      setTimeout(() => router.push("/filing/outcome-report"), 0)
    } else {
      // 待補件不移動案件：等醫策會向醫學會取得新文件後重新上傳
      toast.warning("已標註待補件，案件維持於待審查，取得補件後可重新上傳")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/filing/outcome-report"
          className="mb-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          返回成果報告上傳
        </Link>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {societyName} - 114年度{typeName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {reportCase.uploadedDate ? `上傳日期：${reportCase.uploadedDate}` : "尚未上傳"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="outline" className={OUTCOME_REPORT_STAGE_CONFIG[reportCase.stage].color}>
              {OUTCOME_REPORT_STAGE_CONFIG[reportCase.stage].label}
            </Badge>
            {result && (
              <Badge variant="outline" className={PRELIMINARY_REVIEW_CONFIG[result].color}>
                {PRELIMINARY_REVIEW_CONFIG[result].label}
              </Badge>
            )}
          </div>
        </div>

        {isArchived && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-700">
              <ClipboardCheck className="h-5 w-5 shrink-0" />
              <span className="font-medium">醫事司已審查通過，本案件已歸檔，僅供查看</span>
            </div>
          </div>
        )}

        {result === "待補件" && !isArchived && (
          <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-start gap-2 text-orange-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">初審結果為待補件</p>
                <p className="mt-0.5 text-sm">
                  案件維持於待審查。向醫學會取得補件後，於下方重新上傳並更新初審意見。
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* 填報區：醫策會代醫學會上傳成果報告 */}
          <Card>
            <CardHeader>
              <CardTitle>成果報告上傳</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                上傳{societyName}提交之 114 年度{typeName}。份數不限，可包含報告本文與各項附件。
              </p>
              <MultiFileUpload
                files={reports}
                onUpload={isArchived ? undefined : handleUploadReport}
                onRemove={isArchived ? undefined : handleRemoveReport}
                uploadLabel="選擇成果報告檔案"
                emptyState="尚未上傳成果報告"
              />
            </CardContent>
          </Card>

          {/* 初審區：同為醫策會職責，故與上傳同頁；以底色與上方區隔 */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
                醫策會初步審查
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">
                初審意見將隨案件提送醫事司，作為醫事司審查時的參考。
              </p>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  初審意見 {!isArchived && <span className="text-destructive">*</span>}
                </Label>
                {isArchived ? (
                  <p className="mt-1 whitespace-pre-wrap rounded-lg border bg-white p-3 text-sm text-gray-900">
                    {reviewComment || "無初審意見"}
                  </p>
                ) : (
                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="請說明初步審查結果，例如報告完整性、訓練成效指標達成情形，或需補正之項目..."
                    className="mt-1 min-h-32 bg-white"
                  />
                )}
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">審查會議紀錄</Label>
                <MultiFileUpload
                  files={reviewMinutes}
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
            <Link href="/filing/outcome-report">返回</Link>
          </Button>
          {!isArchived && (
            <>
              <Button variant="outline" onClick={handleSaveUpload}>
                儲存
              </Button>
              <Button
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                disabled={!hasReports}
                onClick={() => handleSubmitReview("待補件")}
              >
                標註待補件
              </Button>
              <Button
                className="bg-[#2d3a8c] text-white hover:bg-[#252f73]"
                disabled={!hasReports}
                onClick={() => handleSubmitReview("通過")}
              >
                初審通過並提送醫事司
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OutcomeReportDetailPage({ params }: { params: Promise<{ societyId: string }> }) {
  const { societyId } = use(params)

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <OutcomeReportDetailContent societyId={societyId} />
    </Suspense>
  )
}
