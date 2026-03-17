"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  FileText,
  Trash2,
  FileIcon,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { TextDiffDisplay } from "@/components/filing/text-diff-display"

// Mock data - this would come from the filing submission
const previousYearData = [
  {
    id: "1",
    title: "一、甄審原則",
    content:
      "衛生福利部（以下簡稱本部）為辦理內科專科醫師甄審（以下簡稱專科醫師甄審），特訂定本原則。",
  },
  {
    id: "2",
    title: "二、醫師資格",
    content: `醫師符合下列資格之一者，得參加專科醫師甄審：

（一）依本部一百零一年六月三十日以前公告該年度所定訓練期間，接受畢業後一般醫學（以下簡稱PGY）訓練：於內科專科醫師訓練醫院接受三年以上之內科臨床訓練，且至少連續九個月以上於同一家醫院接受訓練，並取得該院內科專科醫師訓練期滿之證明文件。`,
  },
  {
    id: "3",
    title: "三、訓練醫院資格",
    content: "訓練醫院應符合本部公告之訓練醫院認定基準。",
  },
  {
    id: "2-2",
    title: "2.2 訓練計畫執行架構",
    content: `2.2.1精神科專科醫師訓練計畫由「衛生福利部專科醫師訓練計畫認定會」(Residency Review Committee，以下簡稱RRC)認可之訓練醫院執行，依據核給名額收訓。訓練醫院應有能力提供各樣資源以達到完整的訓練目標。

2.2.2各訓練醫院應有完整之住院醫師訓練計畫書，詳細載明訓練目標、核心課程、師資、教學資源、訓練課程與訓練方式、考評機制等重點，落實執行且持續檢討改進。

2.2.3教育相關人員應均清楚知道訓練計畫的建構精神與施行策略。

2.2.4為達到本計畫訓練之完整目標。`,
  },
]

// Current year submitted content (from filing)
const currentYearData = [
  {
    id: "1",
    title: "一、甄審原則",
    content:
      "衛生福利部（以下簡稱本部）為辦理內科專科醫師甄審（以下簡稱專科醫師甄審），特訂定本原則。",
    revisionNote: "",
  },
  {
    id: "2",
    title: "二、醫師資格",
    content: `醫師符合下列資格之一者，得參加專科醫師甄審：

（一）依本部一百零一年六月三十日以前公告該年度所定訓練期間，接受畢業後一般醫學（以下簡稱PGY）訓練：於內科專科醫師訓練醫院接受五年以上之內科臨床訓練，且至少連續九個月以上於同一家醫院接受訓練，並取得該院內科專科醫師訓練期滿之證明文件。`,
    revisionNote: "因應衛福部 114 年法規修正，將訓練年限由三年調整為五年。",
  },
  {
    id: "3",
    title: "三、訓練醫院資格",
    content: "訓練醫院必須符合本部公告之訓練醫院認定基準。",
    revisionNote: "將「應」改為「必須」以符合新規定用語。",
  },
  {
    id: "2-2",
    title: "2.2 訓練計畫執行架構",
    content: `2.2.1精神科專科醫師訓練計畫委由「衛生福利部專科醫師訓練計畫認定會」(Residency Review Committee，以下簡稱RRC)認可之訓練醫院執行，依據核給名額收訓。訓練醫院必須有能力提供各樣資源以達到完整的訓練目標。

2.2.2各訓練醫院應有完整之住院醫師訓練計畫書，詳細載明訓練目標、核心課程、師資、教學資源、訓練課程與訓練方式、考評機制等重點，落實執行且持續檢討改進。訓練課程須符合「精神科專科醫師訓練課程基準」(依照衛生福利部最新公告)。

2.2.3教育相關人員應均清楚知道訓練計畫的建構精神與施行策略。

2.2.4為達到本計畫所載訓練之完整目標，不限同一家機構訓練，允許與合作醫院聯合訓練。`,
    revisionNote: "1. 2.2.1 將「由」改為「委由」，「應」改為「必須」\n2. 2.2.2 新增訓練課程基準參照說明\n3. 2.2.4 新增允許聯合訓練之說明",
  },
]

// Documents with two-stage review process
const twoStageDocuments = ["計畫認定基準", "訓練課程基準", "評核標準", "容額分配原則"]

// Review stages for two-stage documents
const twoStageReviewStages = [
  { value: "pending", label: "待審查" },
  { value: "reviewing", label: "承辦審查中" },
  { value: "group-review", label: "分組會議審查" },
  { value: "group-approved", label: "分組會議通過" },
  { value: "rrc-review", label: "RRC 大會審查" },
  { value: "returned", label: "退回補件" },
  { value: "approved", label: "審查通過" },
]

// Review stages for simple documents (甄審原則, 精進指南)
const simpleReviewStages = [
  { value: "pending", label: "待審查" },
  { value: "reviewing", label: "承辦審查中" },
  { value: "returned", label: "退回補件" },
  { value: "approved", label: "審查通過" },
]

// Mock group review files (from previous stage)
const mockGroupReviewFiles = [
  { name: "分組會議紀錄_114-02-20.pdf", size: 2048000, date: "2025-02-20" },
  { name: "分組審查意見彙整.docx", size: 512000, date: "2025-02-20" },
]

const documentInfo = {
  society: "內科醫學會",
  documentType: "計畫認定基準", // Change this to test different document types
  year: "114",
  submittedDate: "2025-03-01",
  currentStage: "rrc-review", // Change this to test different stages
}

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  // Determine if this document has two-stage review
  const hasTwoStageReview = twoStageDocuments.includes(documentInfo.documentType)
  const reviewStages = hasTwoStageReview ? twoStageReviewStages : simpleReviewStages
  const isRRCReviewStage = documentInfo.currentStage === "rrc-review"
  const showGroupReviewFiles = hasTwoStageReview && isRRCReviewStage

  const [expandedSections, setExpandedSections] = useState<string[]>(
    currentYearData.map((s) => s.id)
  )
  const [activeTab, setActiveTab] = useState<string>("current")
  
  // Review state
  const [reviewComment, setReviewComment] = useState("")
  const [currentStage, setCurrentStage] = useState(documentInfo.currentStage)
  const [showStageDialog, setShowStageDialog] = useState(false)
  const [pendingStage, setPendingStage] = useState("")
  
  // Uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number; date: string }>>([])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        name: file.name,
        size: file.size,
        date: new Date().toLocaleDateString("zh-TW"),
      }))
      setUploadedFiles([...uploadedFiles, ...newFiles])
      toast.success(`已上傳 ${newFiles.length} 個檔案`)
    }
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
    toast.success("已移除檔案")
  }

  const handleStageChange = (newStage: string) => {
    setPendingStage(newStage)
    setShowStageDialog(true)
  }

  const confirmStageChange = () => {
    setCurrentStage(pendingStage)
    setShowStageDialog(false)
    const stageLabel = reviewStages.find((s) => s.value === pendingStage)?.label
    toast.success(`審查階段已變更為「${stageLabel}」`)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "pending":
        return "bg-gray-100 text-gray-700"
      case "reviewing":
        return "bg-blue-100 text-blue-700"
      case "group-review":
        return "bg-purple-100 text-purple-700"
      case "group-approved":
        return "bg-purple-100 text-purple-700"
      case "rrc-review":
        return "bg-indigo-100 text-indigo-700"
      case "returned":
        return "bg-red-100 text-red-700"
      case "approved":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleDownload = (format: "word" | "pdf") => {
    toast.success(`正在下載 ${format.toUpperCase()} 檔案...`)
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/review/submissions">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  返回列表
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="text-lg font-semibold">
                  {documentInfo.society} - {documentInfo.documentType}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {documentInfo.year} 年度 | 提交日期：{documentInfo.submittedDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStageColor(currentStage)}>
                {reviewStages.find((s) => s.value === currentStage)?.label}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    下載檔案
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload("word")}>
                    <FileIcon className="h-4 w-4 mr-2" />
                    Word 格式 (.docx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("pdf")}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF 格式 (.pdf)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-16 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-12 bg-transparent border-0 p-0">
              <TabsTrigger 
                value="current" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
              >
                114 年度 (本次送審)
              </TabsTrigger>
              <TabsTrigger 
                value="previous" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
              >
                113 年度 (參考)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="current" className="mt-0 space-y-4">
                {currentYearData.map((section) => {
                  const prevSection = previousYearData.find(
                    (p) => p.id === section.id
                  )
                  const prevContent = prevSection?.content || ""
                  const hasChanges = prevContent !== section.content

                  return (
                    <Collapsible
                      key={section.id}
                      open={expandedSections.includes(section.id)}
                      onOpenChange={() => toggleSection(section.id)}
                    >
                      <div className="bg-white rounded-lg border shadow-sm">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              {expandedSections.includes(section.id) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="font-medium">{section.title}</span>
                              {hasChanges && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                  已修訂
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-4 pb-4 space-y-4">
                            {/* Content Display */}
                            <div className="p-4 bg-gray-50 rounded-lg border">
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {section.content}
                              </p>
                            </div>

                            {/* Diff Display */}
                            {hasChanges && (
                              <div className="p-4 bg-muted/30 rounded-lg border">
                                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-4">
                                  <span>變更比對：</span>
                                  <span className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-red-100 border border-red-200 rounded-sm" />
                                    刪除
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-green-100 border border-green-200 rounded-sm" />
                                    新增
                                  </span>
                                </div>
                                <TextDiffDisplay
                                  oldText={prevContent}
                                  newText={section.content}
                                />
                              </div>
                            )}

                            {/* Revision Note (from filing) */}
                            {section.revisionNote && (
                              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs font-medium text-blue-700 mb-1">
                                  醫學會修訂說明
                                </p>
                                <p className="text-sm text-blue-900 whitespace-pre-wrap">
                                  {section.revisionNote}
                                </p>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  )
                })}
              </TabsContent>

              <TabsContent value="previous" className="mt-0 space-y-4">
                {previousYearData.map((section) => (
                  <Collapsible
                    key={section.id}
                    open={expandedSections.includes(section.id)}
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <div className="bg-white rounded-lg border shadow-sm">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            {expandedSections.includes(section.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-medium">{section.title}</span>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4">
                          <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                              {section.content}
                            </p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Review Actions */}
          <div className="space-y-4">
            {/* Stage Control */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <Label className="text-sm font-medium">審查階段</Label>
              <Select value={currentStage} onValueChange={handleStageChange}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reviewStages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Group Review Files (only shown in RRC review stage for two-stage documents) */}
            {showGroupReviewFiles && (
              <div className="bg-white rounded-lg border shadow-sm p-4">
                <Label className="text-sm font-medium">分組會議審查資料</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  以下為分組會議審查階段通過時上傳之相關文件
                </p>
                <div className="space-y-2">
                  {mockGroupReviewFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-100"
                    >
                      <FileText className="h-4 w-4 text-purple-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} | {file.date}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Comment */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <Label htmlFor="review-comment" className="text-sm font-medium">
                審查評語
              </Label>
              <Textarea
                id="review-comment"
                placeholder="請輸入審查評語或會議決議內容..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mt-2 min-h-[200px]"
              />
              <Button 
                className="w-full mt-3"
                onClick={() => {
                  if (reviewComment.trim()) {
                    toast.success("審查評語已儲存")
                  }
                }}
              >
                儲存評語
              </Button>
            </div>

            {/* Meeting Minutes Upload */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <Label className="text-sm font-medium">
                {isRRCReviewStage ? "RRC 大會會議記錄" : "會議記錄檔案"}
              </Label>
              
              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} | {file.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <div className="mt-3">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <span>
                      <Upload className="h-4 w-4" />
                      上傳會議記錄
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  支援 PDF、Word、Excel 格式
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Change Confirmation Dialog */}
      <Dialog open={showStageDialog} onOpenChange={setShowStageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認變更審查階段</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              確定要將審查階段變更為「
              <span className="font-medium text-foreground">
                {reviewStages.find((s) => s.value === pendingStage)?.label}
              </span>
              」嗎？
            </p>
            {pendingStage === "returned" && (
              <p className="mt-2 text-sm text-amber-600">
                退回補件後，醫學會將收到通知並可重新修改內容。
              </p>
            )}
            {pendingStage === "approved" && (
              <p className="mt-2 text-sm text-green-600">
                審查通過後，此文件將進入公告流程。
              </p>
            )}
            {pendingStage === "group-approved" && (
              <p className="mt-2 text-sm text-purple-600">
                分組會議通過後，此文件將進入 RRC 大會審查階段。
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStageDialog(false)}>
              取消
            </Button>
            <Button onClick={confirmStageChange}>
              確認變更
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
