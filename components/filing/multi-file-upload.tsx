"use client"

import { Button } from "@/components/ui/button"
import { Upload, FileText, X, Download } from "lucide-react"

export interface UploadedFile {
  id: string
  name: string
  size: string
}

interface MultiFileUploadProps {
  files: UploadedFile[]
  /** 未提供代表唯讀：不顯示上傳與移除，改顯示下載。 */
  onUpload?: () => void
  onRemove?: (id: string) => void
  /** 上傳按鈕文字，例如「選擇成果報告檔案」。 */
  uploadLabel?: string
  emptyState?: string
}

/**
 * 份數不定的多檔上傳清單。
 * 與 FileUploadSlot 的差別：FileUploadSlot 是「一個具名欄位對一份檔案」，
 * 適用於欄位固定的版型（主文件、修正對照表）；此元件適用於份數事先未知者，
 * 例如成果報告可能由多份檔案組成。
 */
export function MultiFileUpload({
  files,
  onUpload,
  onRemove,
  uploadLabel = "選擇檔案",
  emptyState = "尚未上傳任何檔案",
}: MultiFileUploadProps) {
  const editable = Boolean(onUpload)

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-gray-400" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">{file.size}</p>
            </div>
          </div>
          {editable && onRemove ? (
            <Button variant="ghost" size="sm" onClick={() => onRemove(file.id)} className="shrink-0">
              <X className="h-4 w-4 text-red-500" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="shrink-0">
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      {files.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
          {emptyState}
        </p>
      )}

      {editable && (
        <Button variant="outline" onClick={onUpload} className="w-full gap-2 border-dashed bg-white">
          <Upload className="h-4 w-4" />
          {uploadLabel}
        </Button>
      )}
    </div>
  )
}
