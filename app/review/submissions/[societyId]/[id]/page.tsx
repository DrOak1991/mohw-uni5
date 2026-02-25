"use client"

import { useState, useRef } from "react"
import { ReviewSimpleNav } from "@/components/review/simple-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Download, Upload, X, MessageSquare, Info, Edit2, Trash2, Edit3 } from 'lucide-react'
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const documentTypeInfo: Record<string, { name: string }> = {
  "screening-principle": { name: "甄審原則" },
  "hospital-accreditation": { name: "訓練醫院認定基準" },
  "training-curriculum": { name: "訓練課程基準" },
  "evaluation-standards": { name: "公告評核標準" },
  "quota-allocation": { name: "留存容額分配原則" },
}

const mockSocieties = [
  { id: "1", name: "台灣內科醫學會" },
  { id: "2", name: "台灣外科醫學會" },
  { id: "3", name: "台灣小兒科醫學會" },
  { id: "4", name: "台灣婦產科醫學會" },
  { id: "5", name: "台灣眼科醫學會" },
  { id: "6", name: "台灣耳鼻喉科醫學會" },
  { id: "7", name: "台灣骨科醫學會" },
  { id: "8", name: "台灣泌尿科醫學會" },
  { id: "9", name: "台灣皮膚科醫學會" },
  { id: "10", name: "台灣神經科醫學會" },
  { id: "11", name: "台灣精神科醫學會" },
  { id: "12", name: "台灣復健科醫學會" },
  { id: "13", name: "台灣麻醉科醫學會" },
  { id: "14", name: "台灣放射線科醫學會" },
  { id: "15", name: "台灣病理科醫學會" },
  { id: "16", name: "台灣核子醫學科醫學會" },
  { id: "17", name: "台灣急診醫學科醫學會" },
  { id: "18", name: "台灣家庭醫學科醫學會" },
  { id: "19", name: "台灣職業醫學科醫學會" },
  { id: "20", name: "台灣整形外科醫學會" },
  { id: "21", name: "台灣神經外科醫學會" },
  { id: "22", name: "台灣胸腔外科醫學會" },
  { id: "23", name: "台灣心臟血管外科醫學會" },
]

const mockContent = {
  current: `第一章 總則

第一條 目的
本原則依據專科醫師訓練計畫認定辦法第三條規定訂定之。

第二條 適用範圍
本原則適用於內科專科醫師訓練計畫之甄審作業。

第三條 甄審委員會
甄審委員會由本學會理事長擔任召集人，委員包括：
一、本學會理事五人
二、外部專家學者三人
三、衛生福利部代表一人

第四條 甄審標準
申請訓練計畫之醫院應符合下列條件：
一、通過醫院評鑑合格
二、具備完整之內科次專科訓練環境
三、有足夠之專任主治醫師擔任教學工作
四、年度住院醫師訓練容額符合規定`,
  previous: `第一章 總則

第一條 目的
本原則依據專科醫師訓練計畫認定辦法第三條規定訂定之。

第二條 適用範圍
本原則適用於內科專科醫師訓練計畫之甄審作業。

第三條 甄審委員會
甄審委員會由本學會理事長擔任召集人，委員包括：
一、本學會理事三人
二、外部專家學者二人

第四條 甄審標準
申請訓練計畫之醫院應符合下列條件：
一、通過醫院評鑑合格
二、具備完整之內科次專科訓練環境
三、有足夠之專任主治醫師擔任教學工作`,
}

interface Comment {
  id: string
  author: string
  date: string
  content: string
  selectedText: string
  highlightId: string
}

interface Edit {
  id: string
  author: string
  date: string
  originalText: string
  modifiedText: string
  reason: string
  highlightId: string
}

export default function SubmissionReviewDetailPage({
  params,
}: {
  params: { societyId: string; id: string }
}) {
  const { societyId, id } = params
  const [stage, setStage] = useState("reviewing")
  const [comments, setComments] = useState<Comment[]>([])
  const [edits, setEdits] = useState<Edit[]>([])
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [showEditInput, setShowEditInput] = useState(false)
  const [commentInputPosition, setCommentInputPosition] = useState({ x: 0, y: 0 })
  const [selectedText, setSelectedText] = useState("")
  const [selectedRange, setSelectedRange] = useState<Range | null>(null)
  const [newCommentText, setNewCommentText] = useState("")
  const [newEditText, setNewEditText] = useState("")
  const [editReason, setEditReason] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentText, setEditingCommentText] = useState("")
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)
  const [deleteEditId, setDeleteEditId] = useState<string | null>(null)
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [reviewComment, setReviewComment] = useState("")
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number }>>([])
  const [announcementSummary, setAnnouncementSummary] = useState("")

  const docInfo = documentTypeInfo[societyId]
  const society = mockSocieties.find((s) => s.id === id)

  if (!docInfo || !society) {
    return <div>找不到資料</div>
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      setShowCommentInput(false)
      setShowEditInput(false)
      return
    }

    const text = selection.toString().trim()
    if (text.length === 0) {
      setShowCommentInput(false)
      setShowEditInput(false)
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    const popupWidth = 320
    const popupHeight = 200
    const padding = 10

    let x = rect.right + padding
    let y = rect.top

    if (x + popupWidth > window.innerWidth) {
      x = rect.left - popupWidth - padding
    }

    if (x < padding) {
      x = padding
    }

    if (y + popupHeight > window.innerHeight) {
      y = window.innerHeight - popupHeight - padding
    }

    if (y < padding) {
      y = padding
    }

    setSelectedText(text)
    setSelectedRange(range)
    setCommentInputPosition({ x, y })
    setShowCommentInput(true)
    setShowEditInput(false)
    setNewEditText(text)
  }

  const handleSaveComment = () => {
    if (!newCommentText.trim() || !selectedRange) return

    const highlightId = `highlight-${Date.now()}`

    const mark = document.createElement("mark")
    mark.id = highlightId
    mark.className = "bg-yellow-200 cursor-pointer hover:bg-yellow-300 transition-colors"
    mark.setAttribute("data-comment-id", highlightId)

    try {
      const contents = selectedRange.extractContents()
      mark.appendChild(contents)
      selectedRange.insertNode(mark)
    } catch (e) {
      console.error("[v0] Error highlighting text:", e)
      return
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: "當前審查員",
      date: new Date().toLocaleString("zh-TW"),
      content: newCommentText,
      selectedText: selectedText,
      highlightId: highlightId,
    }

    setComments([...comments, newComment])
    setNewCommentText("")
    setShowCommentInput(false)
  }

  const handleSaveEdit = () => {
    if (!newEditText.trim() || !selectedRange) return

    const highlightId = `edit-${Date.now()}`

    const mark = document.createElement("mark")
    mark.id = highlightId
    mark.className = "bg-blue-100 border-b-2 border-blue-400 border-dotted cursor-pointer hover:bg-blue-200 transition-colors"
    mark.setAttribute("data-edit-id", highlightId)
    mark.textContent = newEditText

    try {
      selectedRange.deleteContents()
      selectedRange.insertNode(mark)
    } catch (e) {
      console.error("[v0] Error editing text:", e)
      return
    }

    const newEdit: Edit = {
      id: `edit-${Date.now()}`,
      author: "承辦人員",
      date: new Date().toLocaleString("zh-TW"),
      originalText: selectedText,
      modifiedText: newEditText,
      reason: editReason,
      highlightId: highlightId,
    }

    setEdits([...edits, newEdit])
    setNewEditText("")
    setEditReason("")
    setShowEditInput(false)
  }

  const handleCommentClick = (comment: Comment) => {
    const element = document.getElementById(comment.highlightId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      element.classList.add("ring-2", "ring-blue-500")
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-blue-500")
      }, 2000)
    }
  }

  const handleEditClick = (edit: Edit) => {
    const element = document.getElementById(edit.highlightId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      element.classList.add("ring-2", "ring-blue-500")
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-blue-500")
      }, 2000)
    }
    setSelectedEditId(edit.id)
    setTimeout(() => setSelectedEditId(null), 3000)
  }

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditingCommentText(comment.content)
  }

  const handleSaveCommentEdit = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, content: editingCommentText, date: new Date().toLocaleString("zh-TW") } : c
      )
    )
    setEditingCommentId(null)
    setEditingCommentText("")
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditingCommentText("")
  }

  const handleDeleteComment = (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId)
    if (comment) {
      const element = document.getElementById(comment.highlightId)
      if (element) {
        const parent = element.parentNode
        if (parent) {
          while (element.firstChild) {
            parent.insertBefore(element.firstChild, element)
          }
          parent.removeChild(element)
        }
      }

      setComments(comments.filter((c) => c.id !== commentId))
      setDeleteCommentId(null)
    }
  }

  const handleDeleteEdit = (editId: string) => {
    const edit = edits.find((e) => e.id === editId)
    if (edit) {
      const element = document.getElementById(edit.highlightId)
      if (element) {
        const parent = element.parentNode
        if (parent) {
          const textNode = document.createTextNode(edit.originalText)
          parent.insertBefore(textNode, element)
          parent.removeChild(element)
        }
      }

      setEdits(edits.filter((e) => e.id !== editId))
      setDeleteEditId(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        name: file.name,
        size: file.size,
      }))
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleAnnouncement = () => {
    setShowAnnouncementDialog(false)
    alert("公告已送出")
  }

  const renderStageActions = () => {
    switch (stage) {
      case "reviewing":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="review-comment">承辦審查意見</Label>
              <Textarea
                id="review-comment"
                placeholder="請輸入審查意見..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => alert("送出審查通過")}>通過並送下一階段</Button>
              <Button variant="destructive" onClick={() => alert("退回醫學會補件")}>
                退回補件
              </Button>
            </div>
          </div>
        )

      case "group-meeting":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="group-comment">醫策會分組會議審查意見</Label>
              <Textarea
                id="group-comment"
                placeholder="請輸入會議審查意見..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => alert("通過並送 RRC 大會")}>通過並送 RRC 大會</Button>
              <Button variant="outline" onClick={() => alert("確認不通過")}>
                不通過
              </Button>
              <Button variant="destructive" onClick={() => alert("退回醫學會補件")}>
                退回補件
              </Button>
            </div>
          </div>
        )

      case "rrc-meeting":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="rrc-comment">醫策會 RRC 大會審查意見</Label>
              <Textarea
                id="rrc-comment"
                placeholder="請輸入大會審查意見..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setStage("pending-announcement")}>通過並進入待公告</Button>
              <Button variant="outline" onClick={() => alert("確認不通過")}>
                不通過
              </Button>
              <Button variant="destructive" onClick={() => alert("退回醫學會補件")}>
                退回補件
              </Button>
            </div>
          </div>
        )

      case "pending-announcement":
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                審查流程已完成，請上傳公告文件並發布最終審查結果
              </p>
            </div>
            <Button onClick={() => setShowAnnouncementDialog(true)} className="w-full">
              公告最終審查結果
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewSimpleNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/review/submissions" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{society.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{docInfo.name} - 填報審查</p>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-2 bg-gray-50 border-l-4 border-gray-300 px-4 py-3 rounded-r-lg">
            <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">修訂原因</p>
              <p className="text-sm text-gray-700 leading-relaxed">配合衛生福利部 114 年度醫事人力培育政策調整，強化甄審委員會之多元代表性及外部監督機制，並確保訓練醫院之容額分配符合相關規範。</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>醫學會上傳文件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{docInfo.name}.pdf</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      下載
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">上傳日期：2025-01-15</div>
                </div>

                <Tabs defaultValue="comparison" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="comparison">版本比對</TabsTrigger>
                    <TabsTrigger value="current">本年度版本</TabsTrigger>
                    <TabsTrigger value="previous">去年版本</TabsTrigger>
                  </TabsList>

                  <TabsContent value="comparison" className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-900">
                        <strong>版本比對說明：</strong>
                        <span className="bg-green-200 px-1 mx-1">綠色</span>
                        表示新增內容，
                        <span className="bg-red-200 px-1 mx-1">紅色</span>
                        表示刪除內容
                      </p>
                    </div>

                    <div
                      ref={contentRef}
                      className="border rounded-lg p-6 bg-white min-h-[400px] cursor-text prose max-w-none select-text"
                      onMouseUp={handleTextSelection}
                    >
                      <h2>第一章 總則</h2>

                      <h3>第一條 目的</h3>
                      <p>本原則依據專科醫師訓練計畫認定辦法第三條規定訂定之。</p>

                      <h3>第二條 適用範圍</h3>
                      <p>本原則適用於內科專科醫師訓練計畫之甄審作業。</p>

                      <h3>第三條 甄審委員會</h3>
                      <p>甄審委員會由本學會理事長擔任召集人，委員包括：</p>
                      <p>
                        一、本學會理事
                        <span className="bg-red-200 line-through">三</span>
                        <span className="bg-green-200">五</span>人
                      </p>
                      <p>
                        二、外部專家學者
                        <span className="bg-red-200 line-through">二</span>
                        <span className="bg-green-200">三</span>人
                      </p>
                      <p className="bg-green-200">三、衛生福利部代表一人</p>

                      <h3>第四條 甄審標準</h3>
                      <p>申請訓練計畫之醫院應符合下列條件：</p>
                      <p>一、通過醫院評鑑合格</p>
                      <p>二、具備完整之內科次專科訓練環境</p>
                      <p>三、有足夠之專任主治醫師擔任教學工作</p>
                      <p className="bg-green-200">四、年度住院醫師訓練容額符合規定</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="current">
                    <div
                      className="border rounded-lg p-6 bg-white min-h-[400px] cursor-text prose max-w-none whitespace-pre-wrap select-text"
                      onMouseUp={handleTextSelection}
                    >
                      {mockContent.current}
                    </div>
                  </TabsContent>

                  <TabsContent value="previous">
                    <div className="border rounded-lg p-6 bg-white min-h-[400px] prose max-w-none whitespace-pre-wrap">
                      {mockContent.previous}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>審查操作</CardTitle>
              </CardHeader>
              <CardContent>{renderStageActions()}</CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>審查記錄</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="comments" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="comments">
                      審查註解 ({comments.length})
                    </TabsTrigger>
                    <TabsTrigger value="edits">
                      承辦修改 ({edits.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="comments" className="mt-4">
                    {comments.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        尚無審查註解
                        <br />
                        請選取文件中的文字以新增註解
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {comments.map((comment, index) => (
                          <div
                            key={comment.id}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                #{index + 1}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500 mr-2">{comment.date}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleEditComment(comment)}
                                  disabled={editingCommentId === comment.id}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setDeleteCommentId(comment.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            <div
                              className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-gray-600 cursor-pointer"
                              onClick={() => handleCommentClick(comment)}
                            >
                              "{comment.selectedText}"
                            </div>
                            {editingCommentId === comment.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editingCommentText}
                                  onChange={(e) => setEditingCommentText(e.target.value)}
                                  rows={3}
                                  className="text-sm"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    className="flex-1 bg-transparent"
                                  >
                                    取消
                                  </Button>
                                  <Button size="sm" onClick={() => handleSaveCommentEdit(comment.id)} className="flex-1">
                                    儲存
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                                <p className="text-xs text-gray-500">- {comment.author}</p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="edits" className="mt-4">
                    {edits.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        尚無承辦修改記錄
                        <br />
                        請選取文件中的文字以進行修改
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {edits.map((edit, index) => (
                          <div
                            key={edit.id}
                            className={`p-4 rounded-lg border transition-colors ${
                              selectedEditId === edit.id
                                ? "bg-blue-50 border-blue-300 ring-2 ring-blue-500"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                                修改 #{index + 1}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500 mr-2">{edit.date}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setDeleteEditId(edit.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            <div
                              className="space-y-2 cursor-pointer"
                              onClick={() => handleEditClick(edit)}
                            >
                              <div className="p-2 bg-red-50 border border-red-200 rounded">
                                <div className="text-xs text-red-700 font-medium mb-1">原文：</div>
                                <div className="text-xs text-gray-700 line-through">"{edit.originalText}"</div>
                              </div>
                              <div className="p-2 bg-green-50 border border-green-200 rounded">
                                <div className="text-xs text-green-700 font-medium mb-1">修改後：</div>
                                <div className="text-xs text-gray-700">"{edit.modifiedText}"</div>
                              </div>
                              {edit.reason && (
                                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                                  <div className="text-xs text-blue-700 font-medium mb-1">修改原因：</div>
                                  <div className="text-xs text-gray-700">{edit.reason}</div>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">- {edit.author}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>審查歷史記錄</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-l-2 border-blue-500 pl-3 py-2">
                    <div className="text-sm font-medium">承辦審查</div>
                    <div className="text-xs text-gray-500 mt-1">2025-01-20 14:30</div>
                    <div className="text-sm text-gray-700 mt-2">
                      文件內容完整，格式符合規定，建議通過進入下一階段審查。
                    </div>
                  </div>

                  {(stage === "group-meeting" ||
                    stage === "rrc-meeting" ||
                    stage === "pending-announcement") && (
                    <div className="border-l-2 border-purple-500 pl-3 py-2">
                      <div className="text-sm font-medium">醫策會分組會議</div>
                      <div className="text-xs text-gray-500 mt-1">2025-01-22 10:00</div>
                      <div className="text-sm text-gray-700 mt-2">
                        經分組會議討論，委員一致���為訓練計畫符合標準，建議送交 RRC 大會審議。
                      </div>
                    </div>
                  )}

                  {(stage === "rrc-meeting" || stage === "pending-announcement") && (
                    <div className="border-l-2 border-pink-500 pl-3 py-2">
                      <div className="text-sm font-medium">醫策會 RRC 大會</div>
                      <div className="text-xs text-gray-500 mt-1">2025-01-25 14:00</div>
                      <div className="text-sm text-gray-700 mt-2">
                        RRC 大會審議通過，同意該學會提出之訓練計畫，核定通過並進入公告程序。
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showCommentInput && !showEditInput && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80"
          style={{
            left: `${commentInputPosition.x}px`,
            top: `${commentInputPosition.y}px`,
          }}
        >
          <div className="mb-3">
            <Label className="text-sm font-medium mb-2 block">選取的文字</Label>
            <div className="mb-3 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
              "{selectedText.substring(0, 50)}
              {selectedText.length > 50 ? "..." : ""}"
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={() => {
                setShowCommentInput(false)
                setShowEditInput(true)
              }}
              className="w-full"
              variant="outline"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              修改文字
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowEditInput(false)
                setNewCommentText("")
              }}
              className="w-full"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              新增註解
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowCommentInput(false)
                setNewCommentText("")
              }}
              className="w-full"
            >
              取消
            </Button>
          </div>
        </div>
      )}

      {showEditInput && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-96"
          style={{
            left: `${commentInputPosition.x}px`,
            top: `${commentInputPosition.y}px`,
          }}
        >
          <div className="mb-3">
            <Label className="text-sm font-medium mb-2 block">修改文字內容</Label>
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded">
              <div className="text-xs text-red-700 font-medium mb-1">原文：</div>
              <div className="text-xs text-gray-600 line-through">
                "{selectedText.substring(0, 80)}
                {selectedText.length > 80 ? "..." : ""}"
              </div>
            </div>
            <Label className="text-xs text-gray-600 mb-1 block">修改後文字：</Label>
            <Textarea
              placeholder="輸入修改後的文字..."
              value={newEditText}
              onChange={(e) => setNewEditText(e.target.value)}
              rows={3}
              className="text-sm mb-2"
              autoFocus
            />
            <Label className="text-xs text-gray-600 mb-1 block">修改原因（選填）：</Label>
            <Textarea
              placeholder="說明修改原因..."
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              rows={2}
              className="text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowEditInput(false)
                setNewEditText("")
                setEditReason("")
              }}
              className="flex-1"
            >
              取消
            </Button>
            <Button size="sm" onClick={handleSaveEdit} className="flex-1">
              <Edit3 className="w-4 h-4 mr-2" />
              確認修改
            </Button>
          </div>
        </div>
      )}

      {showCommentInput && newCommentText !== "" && !showEditInput && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80"
          style={{
            left: `${commentInputPosition.x}px`,
            top: `${commentInputPosition.y}px`,
          }}
        >
          <div className="mb-3">
            <Label className="text-sm font-medium mb-2 block">新增審查註解</Label>
            <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-gray-600">
              "{selectedText.substring(0, 50)}
              {selectedText.length > 50 ? "..." : ""}"
            </div>
            <Textarea
              placeholder="輸入您的審查意見..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              rows={3}
              className="text-sm"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowCommentInput(false)
                setNewCommentText("")
              }}
              className="flex-1"
            >
              取消
            </Button>
            <Button size="sm" onClick={handleSaveComment} className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              儲存註解
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>公告最終審查結果</DialogTitle>
            <DialogDescription>請上傳審查公文並填寫公告摘要</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="announcement-files">上傳公文檔案</Label>
              <div className="mt-2">
                <label
                  htmlFor="announcement-files"
                  className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">點擊或拖放檔案至此區域</p>
                    <p className="text-xs text-gray-500 mt-1">支援 PDF、Word 等格式</p>
                  </div>
                  <input
                    id="announcement-files"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{file.name}</div>
                          <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeFile(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="announcement-summary">公告內容摘要</Label>
              <Textarea
                id="announcement-summary"
                placeholder="請輸入公告摘要..."
                value={announcementSummary}
                onChange={(e) => setAnnouncementSummary(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAnnouncement}>確認公告</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteCommentId !== null} onOpenChange={() => setDeleteCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除註解</AlertDialogTitle>
            <AlertDialogDescription>此操作無法復原，確定要刪除這則審查註解嗎？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCommentId && handleDeleteComment(deleteCommentId)}
              className="bg-red-600 hover:bg-red-700"
            >
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteEditId !== null} onOpenChange={() => setDeleteEditId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除修改記錄</AlertDialogTitle>
            <AlertDialogDescription>
              此操作會將文字還原為原文，確定要刪除這項修改記錄嗎？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEditId && handleDeleteEdit(deleteEditId)}
              className="bg-red-600 hover:bg-red-700"
            >
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
