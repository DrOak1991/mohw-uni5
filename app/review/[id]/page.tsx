"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileText,
  Download,
  Upload,
  History,
  Eye,
  GitCompare,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Paperclip,
} from "lucide-react"
import Link from "next/link"

const documentSections = [
  {
    id: "1",
    title: "一、依據",
    currentContent: "依據專科醫師分科及甄審辦法第四條規定辦理。",
    previousContent: "依據專科醫師分科及甄審辦法第四條規定辦理。",
    hasChange: false,
    comments: [] as any[],
    isExpanded: true,
  },
  {
    id: "2",
    title: "二、目的",
    currentContent:
      "為確保內科專科醫師訓練品質，建立完善之訓練制度，培育具備專業知能與人文關懷之內科專科醫師。",
    previousContent:
      "為確保內科專科醫師訓練品質，建立完善之訓練制度，培育具備專業知能之內科專科醫師。",
    hasChange: true,
    changeType: "modified",
    comments: [] as any[],
    isExpanded: true,
  },
  {
    id: "3",
    title: "三、訓練目標",
    currentContent: `內科專科醫師完成訓練後應具備以下核心能力：
1. 內科常見疾病之診斷與治療能力
2. 急重症病患之初步處置能力
3. 跨團隊溝通與協調能力
4. 終身學習與自我成長能力
5. 醫學倫理與專業素養
6. 醫病溝通與共享決策能力`,
    previousContent: `內科專科醫師完成訓練後應具備以下核心能力：
1. 內科常見疾病之診斷與治療能力
2. 急重症病患之初步處置能力
3. 跨團隊溝通與協調能力
4. 終身學習與自我成長能力
5. 醫學倫理與專業素養`,
    hasChange: true,
    changeType: "added",
    comments: [
      {
        id: 1,
        author: "分組審查委員",
        date: "2025-03-02",
        content: "建議說明第6點「醫病溝通與共享決策能力」的具體評量方式",
        status: "pending",
      },
    ],
    isExpanded: true,
  },
  {
    id: "4",
    title: "四、訓練期程",
    currentContent: `（一）訓練年限：三年
（二）訓練階段：
    第一年：基礎臨床訓練
    第二年：專科核心訓練
    第三年：進階專科訓練與研究`,
    previousContent: `（一）訓練年限：三年
（二）訓練階段：
    第一年：基礎臨床訓練
    第二年：專科核心訓練
    第三年：進階專科訓練與研究`,
    hasChange: false,
    comments: [] as any[],
    isExpanded: true,
  },
]

const attachments = [
  {
    id: 1,
    name: "分組會議紀錄_20250302.pdf",
    size: "1.2 MB",
    uploadedBy: "系統管理員",
    date: "2025-03-02",
  },
  {
    id: 2,
    name: "審查意見彙整表.xlsx",
    size: "256 KB",
    uploadedBy: "系統管理員",
    date: "2025-03-02",
  },
]

export default function ReviewDetailPage() {
  const [sections, setSections] = useState(documentSections)
  const [showComparison, setShowComparison] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, isExpanded: !section.isExpanded } : section,
      ),
    )
  }

  const addComment = (sectionId: string) => {
    if (!newComment.trim()) return
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              comments: [
                ...section.comments,
                {
                  id: Date.now(),
                  author: "審查委員",
                  date: new Date().toISOString().split("T")[0],
                  content: newComment,
                  status: "pending",
                },
              ],
            }
          : section,
      ),
    )
    setNewComment("")
    setSelectedSection(null)
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/review">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-bold">訓練計畫基準審查</h1>
              <Badge variant="outline">114年度</Badge>
              <Badge variant="default">分組審查中</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              內科醫學會 | 提交日期：2025-03-01
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Switch
              id="comparison-mode"
              checked={showComparison}
              onCheckedChange={setShowComparison}
            />
            <Label htmlFor="comparison-mode" className="text-sm">
              版本比對
            </Label>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            匯出
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 text-destructive border-destructive hover:bg-destructive/10"
              >
                <XCircle className="h-4 w-4" />
                退回補正
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>確認退回補正？</AlertDialogTitle>
                <AlertDialogDescription>
                  文件將退回醫學會進行補正，請確認已填寫完整的審查意見。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground">
                  確認退回
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                審查通過
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>確認審查通過？</AlertDialogTitle>
                <AlertDialogDescription>
                  文件將進入下一審查階段（RRC大會審核）。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction>確認通過</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">文件資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">專科</span>
                <span className="font-medium">內科</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">文件類型</span>
                <span className="font-medium">訓練計畫基準</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">提交日期</span>
                <span className="font-medium">2025-03-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">版本</span>
                <span className="font-medium">v3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">異動狀態</span>
                <Badge variant="default" className="bg-accent">
                  有變更
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">文件大綱</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    className="block px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {section.hasChange && (
                        <div
                          className={`h-2 w-2 rounded-full ${
                            section.changeType === "added" ? "bg-accent" : "bg-chart-4"
                          }`}
                        />
                      )}
                      <span className="truncate">{section.title}</span>
                      {section.comments.length > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {section.comments.length}
                        </Badge>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                審查附件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{attachment.name}</p>
                      <p className="text-xs text-muted-foreground">{attachment.size}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-3 gap-2">
                <Upload className="h-4 w-4" />
                上傳附件
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {showComparison && (
            <Card className="p-4">
              <div className="flex items-center gap-6 text-sm">
                <span className="font-medium">版本比對說明：</span>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-accent/20 border border-accent" />
                  <span>新增內容</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-destructive/20 border border-destructive" />
                  <span>刪除內容</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-chart-4/20 border border-chart-4" />
                  <span>修改內容</span>
                </div>
              </div>
            </Card>
          )}

          {sections.map((section) => (
            <Card key={section.id} id={`section-${section.id}`}>
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    {section.hasChange && (
                      <Badge
                        variant={section.changeType === "added" ? "default" : "outline"}
                        className={
                          section.changeType === "added"
                            ? "bg-accent"
                            : "border-chart-4 text-chart-4"
                        }
                      >
                        {section.changeType === "added" ? "新增" : "修改"}
                      </Badge>
                    )}
                    {section.comments.length > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {section.comments.length}
                      </Badge>
                    )}
                  </div>
                  {section.isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              {section.isExpanded && (
                <CardContent>
                  {showComparison && section.hasChange ? (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          前一年度版本
                        </p>
                        <div className="p-4 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">
                          {section.previousContent}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          本年度版本
                        </p>
                        <div
                          className={`p-4 rounded-lg text-sm whitespace-pre-wrap ${
                            section.changeType === "added"
                              ? "bg-accent/10 border border-accent/30"
                              : "bg-chart-4/10 border border-chart-4/30"
                          }`}
                        >
                          {section.currentContent}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap mb-4">
                      {section.currentContent}
                    </div>
                  )}

                  {section.comments.length > 0 && (
                    <div className="space-y-3 mb-4">
                      <p className="text-sm font-medium">審查意見</p>
                      {section.comments.map((comment: any) => (
                        <div
                          key={comment.id}
                          className="p-3 rounded-lg border bg-muted/30"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {comment.date}
                            </span>
                            <Badge
                              variant={
                                comment.status === "pending" ? "secondary" : "default"
                              }
                              className="ml-auto text-xs"
                            >
                              {comment.status === "pending" ? "待回覆" : "已回覆"}
                            </Badge>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedSection === section.id ? (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="輸入審查意見..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-24"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => addComment(section.id)}>
                          送出意見
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedSection(null)
                            setNewComment("")
                          }}
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => setSelectedSection(section.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      新增審查意見
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

