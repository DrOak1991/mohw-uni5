"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { FilingDetailShell } from "@/components/filing/filing-detail-shell"
import { FileUploadSlot, type FileUploadSlotConfig } from "@/components/filing/file-upload-slot"

interface EvaluationUploadFilingProps {
  documentTitle: string
  status: string
}

interface UploadGroup {
  key: string
  title: string
  slots: FileUploadSlotConfig[]
}

// 評核標準與評核表版型：評核標準 + 評核表，各含主文件與修正對照表，共 4 份
const UPLOAD_GROUPS: UploadGroup[] = [
  {
    key: "standard",
    title: "評核標準",
    slots: [
      { key: "standard-main", label: "評核標準文件", description: "本年度評核標準正式版本", required: true },
      { key: "standard-revision", label: "評核標準修正對照表", description: "與前一版本的逐條修訂對照", required: true },
    ],
  },
  {
    key: "form",
    title: "評核表",
    slots: [
      { key: "form-main", label: "評核表文件", description: "本年度評核表正式版本", required: true },
      { key: "form-revision", label: "評核表修正對照表", description: "與前一版本的逐條修訂對照", required: true },
    ],
  },
]

/** 版型 C：評核標準與評核表（評核標準與評核表）。四份檔案上傳骨架。 */
export function EvaluationUploadFiling({ documentTitle, status }: EvaluationUploadFilingProps) {
  const isReadOnly = status === "approved" || status === "under-review"
  const title = `內科專科醫師${documentTitle} - 114年度文件填報`

  return (
    <FilingDetailShell title={title}>
      <div className="space-y-6">
        {isReadOnly && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="font-medium">此文件已送件，目前為僅供查看狀態</span>
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg p-6">
          <h3 className="font-medium text-foreground mb-1">文件上傳</h3>
          <p className="text-sm text-muted-foreground mb-4">
            請分別上傳「評核標準」與「評核表」的主要文件及其修正對照表，共 4 份。
          </p>
          <div className="space-y-6">
            {UPLOAD_GROUPS.map((group) => (
              <div key={group.key} className="rounded-lg border border-border p-4">
                <h4 className="font-medium text-base text-foreground mb-3">{group.title}</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {group.slots.map((slot) => (
                    <FileUploadSlot key={slot.key} config={slot} disabled={isReadOnly} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="outline">返回</Button>
          {!isReadOnly && <Button className="bg-[#2d3a8c] hover:bg-[#252f73] text-white">儲存</Button>}
        </div>
      </div>
    </FilingDetailShell>
  )
}
