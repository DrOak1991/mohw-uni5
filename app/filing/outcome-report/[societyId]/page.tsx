"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Building2, Landmark, ClipboardCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MultiFileUpload, type UploadedFile } from "@/components/filing/multi-file-upload"
import { AQ_OUTCOME_STATUS_CONFIG, getAqOutcomeReportCase } from "@/lib/mock/additional-quota-outcome-report"

/**
 * 外加容額成果報告詳情。醫事司與醫策會平行審查，各留評論；無「不通過／退回」，
 * 審查完成即歸檔備查。路由參數 societyId 實為外加容額申請案 id。
 */
export default function AdditionalQuotaOutcomeReportDetailPage({
  params,
}: {
  params: Promise<{ societyId: string }>
}) {
  const { societyId: applicationId } = use(params)
  const router = useRouter()
  const reportCase = getAqOutcomeReportCase(applicationId)

  const [reports, setReports] = useState<UploadedFile[]>(reportCase?.reports ?? [])
  const [mohwComment, setMohwComment] = useState(reportCase?.mohwComment ?? "")
  const [jctComment, setJctComment] = useState(reportCase?.jctComment ?? "")

  if (!reportCase) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/filing/outcome-report"
            className="mb-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4" />
            返回外加容額成果報告
          </Link>
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">找不到此案件</p>
          </div>
        </div>
      </div>
    )
  }

  const isArchived = reportCase.status === "已歸檔"

  const handleUploadReport = () =>
    setReports((prev) => [
      ...prev,
      { id: `r-${Date.now()}`, name: `外加容額成果報告_補充${prev.length + 1}.pdf`, size: "1.9 MB" },
    ])
  const handleRemoveReport = (id: string) => setReports((prev) => prev.filter((f) => f.id !== id))

  const handleSave = () => toast.success("已儲存審查評論")
  const handleArchive = () => {
    toast.success("審查完成，已歸檔備查")
    setTimeout(() => router.push("/filing/outcome-report"), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/filing/outcome-report"
          className="mb-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          返回外加容額成果報告
        </Link>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {reportCase.hospitalName}（{reportCase.specialty}）- 外加容額成果報告
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              分類原則：{reportCase.classificationPrinciple}　公告日期：{reportCase.announcementDate}
              {reportCase.archivedDate && `　歸檔日期：${reportCase.archivedDate}`}
            </p>
          </div>
          <Badge variant="outline" className={AQ_OUTCOME_STATUS_CONFIG[reportCase.status].color}>
            {AQ_OUTCOME_STATUS_CONFIG[reportCase.status].label}
          </Badge>
        </div>

        {isArchived && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-700">
              <ClipboardCheck className="h-5 w-5 shrink-0" />
              <span className="font-medium">本成果報告審查完成並已歸檔，僅供查看</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* 成果報告：訓練醫院系統外發函，於系統登錄 */}
          <Card>
            <CardHeader>
              <CardTitle>成果報告</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                訓練醫院提交之外加容額成果報告，共 {reports.length} 份。
              </p>
              <MultiFileUpload
                files={reports}
                onUpload={isArchived ? undefined : handleUploadReport}
                onRemove={isArchived ? undefined : handleRemoveReport}
                uploadLabel="登錄成果報告檔案"
                emptyState="尚未登錄成果報告"
              />
            </CardContent>
          </Card>

          {/* 醫事司與醫策會平行審查評論。mock 不分權限，兩區皆可填。 */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-blue-200 bg-blue-50/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Landmark className="h-5 w-5 text-blue-600" />
                  醫事司審查評論
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isArchived ? (
                  <p className="whitespace-pre-wrap rounded-lg border bg-white p-3 text-sm text-gray-900">
                    {mohwComment || "無評論"}
                  </p>
                ) : (
                  <Textarea
                    value={mohwComment}
                    onChange={(e) => setMohwComment(e.target.value)}
                    placeholder="醫事司就成果報告之審查評論..."
                    className="min-h-32 bg-white"
                  />
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-slate-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-5 w-5 text-slate-500" />
                  醫策會審查評論
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isArchived ? (
                  <p className="whitespace-pre-wrap rounded-lg border bg-white p-3 text-sm text-gray-900">
                    {jctComment || "無評論"}
                  </p>
                ) : (
                  <Textarea
                    value={jctComment}
                    onChange={(e) => setJctComment(e.target.value)}
                    placeholder="醫策會就成果報告之審查評論..."
                    className="min-h-32 bg-white"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/filing/outcome-report">返回</Link>
          </Button>
          {!isArchived && (
            <>
              <Button variant="outline" onClick={handleSave}>
                儲存
              </Button>
              <Button className="bg-[#2d3a8c] text-white hover:bg-[#252f73]" onClick={handleArchive}>
                完成審查並歸檔
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
