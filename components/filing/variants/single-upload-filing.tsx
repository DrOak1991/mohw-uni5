"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { FilingDetailShell } from "@/components/filing/filing-detail-shell"
import { FileUploadSlot, type FileUploadSlotConfig } from "@/components/filing/file-upload-slot"

interface SingleUploadFilingProps {
  documentTitle: string
  status: string
}

// 單主文件上傳版型：上傳 1 份主文件 + 1 份修正對照表
const UPLOAD_SLOTS: FileUploadSlotConfig[] = [
  { key: "main", label: "主要文件", description: "本年度文件正式版本", required: true },
  { key: "revision-table", label: "修正對照表", description: "與前一版本的逐條修訂對照", required: true },
]

/** 版型 B：單主文件上傳（訓練課程基準、甄審原則）。目前為上傳區骨架。 */
export function SingleUploadFiling({ documentTitle, status }: SingleUploadFilingProps) {
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
          <p className="text-sm text-muted-foreground mb-4">請上傳本年度主要文件及其修正對照表，共 2 份。</p>
          <div className="grid gap-4 md:grid-cols-2">
            {UPLOAD_SLOTS.map((slot) => (
              <FileUploadSlot key={slot.key} config={slot} disabled={isReadOnly} />
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
