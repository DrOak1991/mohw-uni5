import { Button } from "@/components/ui/button"
import { Upload, FileText } from "lucide-react"

export interface FileUploadSlotConfig {
  key: string
  label: string
  description?: string
  required?: boolean
}

interface FileUploadSlotProps {
  config: FileUploadSlotConfig
  disabled?: boolean
}

/**
 * 單一檔案上傳區塊骨架。供「單主文件上傳」與「評核標準與評核表」版型共用。
 * 目前為骨架：呈現上傳區與說明，實際上傳/驗證/下載互動待後續設計。
 */
export function FileUploadSlot({ config, disabled = false }: FileUploadSlotProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-2 mb-3">
        <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-base text-foreground">
            {config.label}
            {config.required && <span className="text-destructive ml-1">*</span>}
          </p>
          {config.description && <p className="text-sm text-muted-foreground mt-0.5">{config.description}</p>}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-center">
        <Upload className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">拖曳檔案至此，或點擊下方按鈕選擇檔案</p>
        <p className="text-xs text-muted-foreground">支援 Word、PDF 格式，單檔上限 20MB</p>
        <Button variant="outline" size="sm" className="mt-2 gap-2" disabled={disabled}>
          <Upload className="h-4 w-4" />
          選擇檔案
        </Button>
      </div>
    </div>
  )
}
