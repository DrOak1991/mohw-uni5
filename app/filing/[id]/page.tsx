"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Eye,
  Download,
  Plus,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const documentOutline = [
  {
    id: "1",
    title: "一、甄審原則",
    content: "衛生福利部（以下簡稱本部）為辦理內科專科醫師甄審（以下簡稱專科醫師甄審），特訂定本原則。",
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
    content: "",
  },
]

const reviewComments = [
  {
    id: "1",
    sectionId: "1",
    sectionTitle: "一、訓練目標",
    comment: "第二章第三節請再說明教學設備標準",
    hasComment: true,
  },
  {
    id: "2",
    sectionId: "2",
    sectionTitle: "二、訓練期限",
    comment: "訓練期限需明確標示起訖日期",
    hasComment: true,
  },
  {
    id: "3",
    sectionId: "3",
    sectionTitle: "三、訓練醫院資格",
    comment: "",
    hasComment: false,
  },
]

const historicalVersions = [
  { year: "2024", title: "內科醫學會 訓練醫院認定基準" },
  { year: "2023", title: "內科醫學會 訓練醫院認定基準" },
  { year: "2022", title: "內科醫學會 訓練醫院認定基準" },
]

export default function FilingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const status = searchParams.get("status") || "待審查"

  const [documentMethod, setDocumentMethod] = useState<string>("change")
  const [showVersionDialog, setShowVersionDialog] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["1"])
  const [activeSection, setActiveSection] = useState("1")
  const [sectionContents, setSectionContents] = useState<Record<string, string>>({
    "1": documentOutline[0].content,
    "2": documentOutline[1].content,
    "3": documentOutline[2].content,
  })

  const hasReviewComments = status === "需補件"
  const isReadOnly = status === "通過"
  const showDocumentMethodChoice = status === "待審查"

  const getDocumentTitle = () => {
    const titles: Record<string, string> = {
      plan: "計畫認定基準",
      course: "訓練醫院認定基準",
      evaluation: "評核標準",
      "quota-principle": "容額分配原則",
      guidelines: "精進指南",
      "review-principles": "甄審原則",
    }
    return titles[id] || "甄審原則"
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId],
    )
  }

  const updateContent = (sectionId: string, content: string) => {
    setSectionContents((prev) => ({
      ...prev,
      [sectionId]: content,
    }))
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="bg-[#1e2a5e] text-white/70 text-sm py-2">
        <div className="container mx-auto px-6">規範文件管理 / 專科醫師訓練管理系統</div>
      </div>

      <div className="container mx-auto px-6 pt-6">
        <Link
          href="/filing"
          className="inline-flex items-center text-primary hover:underline text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回填報專區
        </Link>

        <div className="flex items-center justify-between mt-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            內科專科醫師{getDocumentTitle()} - 年度文件設定
          </h1>
          <Button
            variant="outline"
            onClick={() => setShowVersionDialog(true)}
            className="text-primary border-primary hover:bg-primary/5"
          >
            其他年度版本
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-8">
        <div className="flex gap-6">
          <div className="w-72 shrink-0">
            <div className="bg-card rounded-lg p-4">
              {hasReviewComments ? (
                <>
                  <div className="text-sm font-medium text-muted-foreground mb-4">
                    大綱 / 審查評語
                  </div>
                  <nav className="space-y-1">
                    {reviewComments.map((item) => (
                      <div key={item.id}>
                        <button
                          onClick={() => setActiveSection(item.sectionId)}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                            activeSection === item.sectionId
                              ? "bg-[#e8edf7] text-primary font-medium"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {item.sectionTitle}
                            {item.hasComment && (
                              <span className="h-2 w-2 rounded-full bg-orange-400" />
                            )}
                          </div>
                        </button>
                        {item.hasComment && (
                          <div className="ml-4 mt-1 mb-2 px-3 py-2 bg-yellow-50 border-l-2 border-yellow-400 text-xs text-yellow-800 rounded-r">
                            {item.comment}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </>
              ) : (
                <nav className="space-y-1">
                  {documentOutline.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? "bg-[#e8edf7] text-primary font-medium"
                          : "hover:bg-muted"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {isReadOnly && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-green-700">
                  <span className="h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                    V
                  </span>
                  <span className="font-medium">此文件已通過審查，僅供查看及匯出</span>
                </div>
              </div>
            )}

            {showDocumentMethodChoice && (
              <div className="bg-card rounded-lg p-6">
                <h3 className="font-medium text-foreground mb-4">本年度文件處理方式</h3>
                <RadioGroup value={documentMethod} onValueChange={setDocumentMethod}>
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 mb-3 ${
                      documentMethod === "change"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <RadioGroupItem value="change" id="change" />
                    <Label htmlFor="change" className="cursor-pointer">
                      變更文件
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 ${
                      documentMethod === "no-change"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <RadioGroupItem value="no-change" id="no-change" />
                    <Label htmlFor="no-change" className="cursor-pointer">
                      不變更
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {hasReviewComments && (
              <div className="bg-card rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-5 w-5 rounded-full border-2 border-current flex items-center justify-center text-xs">
                      i
                    </span>
                    前次提交檔案
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-4 w-4" />
                      檢視
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          下載
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          下載 Word 檔
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          下載 PDF 檔
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card rounded-lg p-6">
              <h3 className="font-medium text-foreground mb-4">大綱</h3>

              <div className="space-y-4">
                {documentOutline.map((section) => (
                  <Collapsible
                    key={section.id}
                    open={expandedSections.includes(section.id)}
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <div className="border rounded-lg">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/50">
                          <div className="flex items-center gap-2">
                            {expandedSections.includes(section.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-medium">{section.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">展開</span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4">
                          <Textarea
                            value={sectionContents[section.id] || ""}
                            onChange={(e) => updateContent(section.id, e.target.value)}
                            className={`min-h-32 border-2 ${
                              isReadOnly
                                ? "bg-muted/50 border-border"
                                : "border-primary/30 focus:border-primary"
                            }`}
                            placeholder="請輸入內容..."
                            disabled={
                              isReadOnly || (showDocumentMethodChoice && documentMethod === "no-change")
                            }
                            readOnly={isReadOnly}
                          />
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>

              {!isReadOnly && (
                <button className="mt-4 flex items-center gap-1 text-primary text-sm hover:underline">
                  <Plus className="h-4 w-4" />
                  新增章節
                </button>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline">{isReadOnly ? "返回" : "取消"}</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    匯出檔案
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    匯出 Word 檔
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    匯出 PDF 檔
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {!isReadOnly && (
                <Button className="bg-[#2d3a8c] hover:bg-[#252f73] text-white">
                  儲存草稿
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>歷年版本</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {historicalVersions.map((version) => (
              <div
                key={version.year}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <div className="font-medium">{version.year}年度</div>
                  <div className="text-sm text-muted-foreground">{version.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    預覽
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        下載
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Word 檔
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF 檔
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-2">
            <Button
              onClick={() => setShowVersionDialog(false)}
              className="bg-[#2d3a8c] hover:bg-[#252f73] text-white"
            >
              關閉
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

