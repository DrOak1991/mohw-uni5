"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MessageSquare, Save, Info, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ReviewSimpleNav } from "@/components/review/simple-nav"

// 模擬資料
const mockDocument = {
  id: "doc1",
  name: "甄審原則",
  societyName: "內科醫學會",
  year: "115",
  lastModified: "2025-01-05",
}

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
  position: string
  selectedText: string
  highlightId: string
}

const mockComments: Comment[] = []

export default function DocumentReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [overallFeedback, setOverallFeedback] = useState("")
  const [groupReviewFeedback, setGroupReviewFeedback] = useState("")
  const [rrcReviewFeedback, setRrcReviewFeedback] = useState("")
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null)

  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentInputPosition, setCommentInputPosition] = useState({ x: 0, y: 0 })
  const [selectedText, setSelectedText] = useState("")
  const [selectedRange, setSelectedRange] = useState<Range | null>(null)
  const [newCommentText, setNewCommentText] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentText, setEditingCommentText] = useState("")
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      setShowCommentInput(false)
      return
    }

    const text = selection.toString().trim()
    if (text.length === 0) {
      setShowCommentInput(false)
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    // 計算彈出框位置，確保在可視範圍內
    const popupWidth = 320 // 彈出框寬度
    const popupHeight = 200 // 預估彈出框高度
    const padding = 10

    let x = rect.right + padding
    let y = rect.top

    // 檢查右邊界，如果超出則顯示在左側
    if (x + popupWidth > window.innerWidth) {
      x = rect.left - popupWidth - padding
    }

    // 檢查左邊界
    if (x < padding) {
      x = padding
    }

    // 檢查下邊界
    if (y + popupHeight > window.innerHeight) {
      y = window.innerHeight - popupHeight - padding
    }

    // 檢查上邊界
    if (y < padding) {
      y = padding
    }

    setSelectedText(text)
    setSelectedRange(range)
    setCommentInputPosition({ x, y })
    setShowCommentInput(true)
  }

  const handleSaveComment = () => {
    if (!newCommentText.trim() || !selectedRange) return

    const highlightId = `highlight-${Date.now()}`

    const mark = document.createElement("mark")
    mark.id = highlightId
    mark.className = "bg-yellow-200 cursor-pointer hover:bg-yellow-300 transition-colors"
    mark.setAttribute("data-comment-id", highlightId)

    try {
      // 提取選取的內容
      const contents = selectedRange.extractContents()

      // 將內容放入 mark 元素中
      mark.appendChild(contents)

      // 將 mark 插入到原位置
      selectedRange.insertNode(mark)

      // 清除選取狀態（如果需要的話）
      // window.getSelection()?.removeAllRanges()
    } catch (e) {
      console.error("[v0] Error highlighting text:", e)
      return
    }

    // 新增註解
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: "當前審查員",
      date: new Date().toLocaleString("zh-TW"),
      content: newCommentText,
      position: "選取段落",
      selectedText: selectedText,
      highlightId: highlightId,
    }

    setComments([...comments, newComment])
    setNewCommentText("")
    setShowCommentInput(false)
  }

  const handleCommentClick = (comment: Comment) => {
    const element = document.getElementById(comment.highlightId)
    if (element) {
      setActiveHighlight(comment.highlightId)

      // 滾動到該元素
      element.scrollIntoView({ behavior: "smooth", block: "center" })

      // 添加臨時高亮效果
      element.classList.add("ring-2", "ring-blue-500")
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-blue-500")
      }, 2000)
    }
  }

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditingCommentText(comment.content)
  }

  const handleSaveEdit = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, content: editingCommentText, date: new Date().toLocaleString("zh-TW") } : c,
      ),
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
      // 移除高亮標記
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

      // 移除註解
      setComments(comments.filter((c) => c.id !== commentId))
      setDeleteCommentId(null)
    }
  }

  const handleSaveAndReturn = () => {
    console.log("[v0] Saving feedback:", overallFeedback)
    router.push(`/review/submissions/${params.societyId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewSimpleNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href={`/review/submissions/${params.societyId}`} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回文件列表
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{mockDocument.name}</h1>
                <Badge variant="outline">{mockDocument.societyName}</Badge>
                <Badge variant="outline">{mockDocument.year} 年度</Badge>
              </div>
              <p className="text-sm text-gray-500">送件日期：{mockDocument.lastModified}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">審查操作說明</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>使用滑鼠選取文件中的特定文字段落，即可新增針對該段落的審查註解</li>
                <li>點擊右側註解列表中的任一註解，可在文件中醒目顯示對應的文字段落</li>
                <li>完成所有審查後，請在下方填寫文件整體回饋並儲存</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <Tabs defaultValue="comparison" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="comparison" className="text-base">
                    版本比對
                  </TabsTrigger>
                  <TabsTrigger value="current" className="text-base">
                    本年度版本
                  </TabsTrigger>
                  <TabsTrigger value="previous" className="text-base">
                    去年版本
                  </TabsTrigger>
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

                  <div ref={contentRef} className="prose max-w-none select-text" onMouseUp={handleTextSelection}>
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
                  <div className="prose max-w-none whitespace-pre-wrap select-text" onMouseUp={handleTextSelection}>
                    {mockContent.current}
                  </div>
                </TabsContent>

                <TabsContent value="previous">
                  <div className="prose max-w-none whitespace-pre-wrap">{mockContent.previous}</div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                審查註解 ({comments.length})
              </h2>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    尚無審查註解
                    <br />
                    請選取文件中的文字以新增註解
                  </p>
                ) : (
                  comments.map((comment, index) => (
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
                            <Button size="sm" onClick={() => handleSaveEdit(comment.id)} className="flex-1">
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
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">RRC 分組會議審查記錄</h2>
            <div className="space-y-4">
              <Textarea
                placeholder="記錄 RRC 分組會議的審查意見與討論內容..."
                value={groupReviewFeedback}
                onChange={(e) => setGroupReviewFeedback(e.target.value)}
                rows={4}
                className="w-full"
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">RRC 大會審查記錄</h2>
            <div className="space-y-4">
              <Textarea
                placeholder="記錄 RRC 大會的最終審查意見與決議..."
                value={rrcReviewFeedback}
                onChange={(e) => setRrcReviewFeedback(e.target.value)}
                rows={4}
                className="w-full"
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">文件整體回饋</h2>
            <div className="space-y-4">
              <Textarea
                placeholder="針對本文件提供整體性的審查意見..."
                value={overallFeedback}
                onChange={(e) => setOverallFeedback(e.target.value)}
                rows={4}
                className="w-full"
              />
              <div className="flex justify-end">
                <Button onClick={handleSaveAndReturn} className="min-w-[120px]">
                  <Save className="w-4 h-4 mr-2" />
                  儲存
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showCommentInput && (
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
    </div>
  )
}
