"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText, Edit3, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { filingItemsConfig } from "@/lib/mock/review-outline"
import { FILING_DOCUMENTS, getFilingStatusLabel } from "@/lib/mock/filing-documents"

// 從 filingItemsConfig 建立開放狀態查詢表
const filingStatusMap = Object.fromEntries(filingItemsConfig.map((item) => [item.id, item.status]))

const documents = FILING_DOCUMENTS

// 可送件的狀態（已有內容但尚未送出）
const submittableStatuses = ["pending", "needs-revision", "not-submitted"]

const getStatusStyle = (status: string) => {
  switch (status) {
    case "under-review":
      return "text-blue-600"
    case "needs-revision":
      return "text-orange-600"
    case "approved":
      return "text-green-600"
    default:
      return "text-muted-foreground"
  }
}

/**
 * 文件填報（獨立路由）。容額填報已拆分至 /filing/quota-filing，各自從 nav 進入。
 */
export default function FilingPage() {
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [selectedSubmitIds, setSelectedSubmitIds] = useState<string[]>([])

  const submittableDocs = documents.filter((doc) => {
    const filingOpen = filingStatusMap[doc.id] === "open"
    return filingOpen && submittableStatuses.includes(doc.status)
  })

  const toggleSubmitDoc = (id: string) =>
    setSelectedSubmitIds((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]))

  const handleOpenSubmitDialog = () => {
    setSelectedSubmitIds(submittableDocs.map((d) => d.id))
    setShowSubmitDialog(true)
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">文件填報</h1>
        <p className="text-base text-muted-foreground mt-1">內科醫學會 - 2025年度</p>
      </div>

      <div className="container mx-auto px-6 pb-8">
        <div className="bg-card rounded-lg shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/50 border-b text-base font-medium text-muted-foreground">
            <div className="col-span-3">文件名稱</div>
            <div className="col-span-2">最近公告日期</div>
            <div className="col-span-3">最近公告文號</div>
            <div className="col-span-1 text-center">審查狀態</div>
            <div className="col-span-1 text-center">送件期限</div>
            <div className="col-span-2 text-right">操作</div>
          </div>
          <div className="divide-y">
            {documents.map((doc) => {
              const filingOpen = filingStatusMap[doc.id] === "open"
              return (
                <div
                  key={doc.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-5 items-center ${!filingOpen ? "bg-muted/20" : ""}`}
                >
                  <div className="col-span-3">
                    <span className={`font-medium ${!filingOpen ? "text-muted-foreground" : "text-foreground"}`}>
                      {doc.title}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">{doc.latestAnnouncementDate || "—"}</div>
                  <div className="col-span-3 text-sm text-muted-foreground truncate">
                    {doc.latestAnnouncementNumber || "—"}
                  </div>
                  <div
                    className={`col-span-1 text-center font-medium ${
                      !filingOpen ? "text-muted-foreground/60" : getStatusStyle(doc.status)
                    }`}
                  >
                    {filingOpen ? getFilingStatusLabel(doc.status) : "尚未開放"}
                  </div>
                  <div className="col-span-1 text-center text-sm text-muted-foreground">
                    {filingOpen ? doc.deadline : "—"}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {filingOpen ? (
                      <Link href={`/filing/${doc.id}?status=${doc.status}`}>
                        {doc.status === "approved" || doc.status === "under-review" ? (
                          <Button size="sm" variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" />
                            {doc.status === "approved" ? "已通過" : "審查中"}
                          </Button>
                        ) : doc.status === "not-submitted" ? (
                          <Button size="sm" className="gap-2 bg-[#2d3a8c] hover:bg-[#252f73] text-white">
                            <Edit3 className="h-4 w-4" />
                            開始填寫
                          </Button>
                        ) : (
                          <Button size="sm" className="gap-2 bg-[#2d3a8c] hover:bg-[#252f73] text-white">
                            <Edit3 className="h-4 w-4" />
                            編輯
                          </Button>
                        )}
                      </Link>
                    ) : (
                      <Link href={`/filing/${doc.id}?status=view`}>
                        <Button size="sm" variant="outline" className="gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          檢視前年度
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Button
            size="lg"
            className="gap-2 bg-[#2d3a8c] hover:bg-[#252f73] text-white"
            disabled={submittableDocs.length === 0}
            onClick={handleOpenSubmitDialog}
          >
            <Send className="h-4 w-4" />
            送件
            {submittableDocs.length > 0 && (
              <span className="ml-1 bg-white/20 text-white text-sm px-1.5 py-0.5 rounded-full">
                {submittableDocs.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>選擇要送件的文件</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-base text-muted-foreground mb-4">
              請勾選本次要送出審查的文件。送出後將無法再編輯，直到審查結果出爐。
            </p>
            {submittableDocs.length === 0 ? (
              <p className="text-base text-muted-foreground text-center py-6">目前沒有可送件的文件</p>
            ) : (
              <div className="space-y-2">
                {submittableDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedSubmitIds.includes(doc.id) ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                    }`}
                    onClick={() => toggleSubmitDoc(doc.id)}
                  >
                    <Checkbox
                      checked={selectedSubmitIds.includes(doc.id)}
                      onCheckedChange={() => toggleSubmitDoc(doc.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base">{doc.title}</p>
                      <p className="text-base text-muted-foreground mt-0.5">
                        送件期限：{doc.deadline}　狀態：
                        <span className={getStatusStyle(doc.status)}>{getFilingStatusLabel(doc.status)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              取消
            </Button>
            <Button
              className="gap-2 bg-[#2d3a8c] hover:bg-[#252f73] text-white"
              disabled={selectedSubmitIds.length === 0}
              onClick={() => setShowSubmitDialog(false)}
            >
              <Send className="h-4 w-4" />
              確認送出 {selectedSubmitIds.length > 0 && `(${selectedSubmitIds.length} 件)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
