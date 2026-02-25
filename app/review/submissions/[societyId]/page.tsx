"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, FileText, MessageSquare, Clock, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ReviewSimpleNav } from "@/components/review/simple-nav"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// 模擬資料
const mockSociety = {
  id: "1",
  name: "內科醫學會",
  year: "115",
  submittedDate: "2025-01-05",
  status: "pending", // pending, in-approval, approved, returned
}

const mockDocuments = [
  {
    id: "doc1",
    name: "甄審原則",
    commentCount: 3,
    lastReviewDate: "2025-01-10 14:30",
  },
  {
    id: "doc2",
    name: "訓練醫院認定基準",
    commentCount: 0,
    lastReviewDate: null,
  },
  {
    id: "doc3",
    name: "訓練課程基準",
    commentCount: 5,
    lastReviewDate: "2025-01-09 16:45",
  },
  {
    id: "doc4",
    name: "評核標準與評核表",
    commentCount: 2,
    lastReviewDate: "2025-01-11 10:20",
  },
  {
    id: "doc5",
    name: "容額分配原則",
    commentCount: 0,
    lastReviewDate: null,
  },
]

export default function SocietyDocumentsPage() {
  const params = useParams()
  const router = useRouter()
  const [returnReason, setReturnReason] = useState("")

  const handlePrintAll = () => {
    window.print()
  }

  const handlePrintSingle = (docId: string) => {
    // 實際應用中會導向特定文件的列印頁面
    console.log("[v0] Printing document:", docId)
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewSimpleNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/review/submissions" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{mockSociety.name}</h1>
                <Badge variant="outline" className="text-sm">
                  {mockSociety.year} 年度
                </Badge>
              </div>
              <p className="text-sm text-gray-500">送件日期：{mockSociety.submittedDate}</p>
            </div>
            <Button variant="outline" onClick={handlePrintAll}>
              <Printer className="w-4 h-4 mr-2" />
              列印全部文件
            </Button>
          </div>
        </div>

        <Card className="p-4 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">審查操作</h2>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
                  退回修改
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>退回修改</DialogTitle>
                  <DialogDescription>請說明退回原因，此訊息將通知醫學會進行修改</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="return-reason">退回原因 *</Label>
                  <Textarea
                    id="return-reason"
                    placeholder="請詳細說明需要修改的內容..."
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline">取消</Button>
                  <Button variant="destructive">確認退回</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
              標記為待 RRC 審查
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">提交文件</h2>
          <div className="grid gap-4">
            {mockDocuments.map((doc) => {
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{doc.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{doc.commentCount} 則註解</span>
                        </div>
                        {doc.lastReviewDate ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>最後審查：{doc.lastReviewDate}</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            尚未審查
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handlePrintSingle(doc.id)}>
                      <Printer className="w-4 h-4" />
                    </Button>
                    <Button asChild>
                      <Link href={`/review/submissions/${params.societyId}/documents/${doc.id}`}>檢視審查</Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
