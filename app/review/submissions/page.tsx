"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Clock, ChevronRight, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ReviewSimpleNav } from "@/components/review/simple-nav"
import {
  getDocumentSubmissions,
  getDocumentTypes,
  getSocieties,
  getStageColors,
  getStagesForDocumentType,
  getCurrentStageForDocumentType,
  getSubmissionCountsByStage,
  advanceDocumentTypeToNextStage,
} from "@/lib/mock/review-submissions"

export default function SubmissionsReviewPage() {
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDocumentType, setActiveDocumentType] = useState("screening-principle")
  const [currentStage, setCurrentStage] = useState("pending-review")
  const [showAdvanceDialog, setShowAdvanceDialog] = useState(false)

  const documentTypes = getDocumentTypes()
  const allStagesForActiveType = getStagesForDocumentType(activeDocumentType)
  const currentDocumentSubmissions = getDocumentSubmissions(activeDocumentType)
  const societies = getSocieties()
  const currentDocumentStage = getCurrentStageForDocumentType(activeDocumentType)

  const filteredSubmissions = currentDocumentSubmissions
    .map((submission) => ({
      ...submission,
      society: societies.find((s) => s.id === submission.societyId)!,
    }))
    .filter((submission) => submission.society.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((submission) => submission.stage === currentStage)
    .sort((a, b) => {
      if (a.uploaded && !b.uploaded) return -1
      if (!a.uploaded && b.uploaded) return 1
      return 0
    })

  const stagesWithCounts = allStagesForActiveType.map((stage) => ({
    ...stage,
    count: currentDocumentSubmissions.filter((s) => s.stage === stage.value).length,
  }))

  const currentStageLabel = allStagesForActiveType.find((s) => s.value === currentDocumentStage)?.label || currentDocumentStage
  const nextStageIndex = allStagesForActiveType.findIndex((s) => s.value === currentDocumentStage) + 1
  const hasNextStage = nextStageIndex < allStagesForActiveType.length
  const nextStageLabel = hasNextStage ? allStagesForActiveType[nextStageIndex].label : null

  const handleAdvanceStage = () => {
    if (advanceDocumentTypeToNextStage(activeDocumentType)) {
      setShowAdvanceDialog(false)
      // 自動切換到下一階段的 tab
      if (nextStageLabel) {
        setCurrentStage(allStagesForActiveType[nextStageIndex].value)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewSimpleNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">填報審查</h1>
            <p className="text-sm text-gray-500 mt-1">以文件類型為單位檢視各醫學會的填報狀態並進行審查</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm text-gray-600">目前階段：</span>
              <Badge className={`${getStageColors()[currentDocumentStage] || "bg-gray-100 text-gray-800"} text-base px-3 py-1.5`}>
                {currentStageLabel}
              </Badge>
              {hasNextStage && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 ml-2"
                  onClick={() => setShowAdvanceDialog(true)}
                >
                  <ArrowRight className="h-4 w-4" />
                  推進至{nextStageLabel}
                </Button>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchExpanded(!searchExpanded)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {searchExpanded && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <Input
                placeholder="搜尋醫學會名稱..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
            </CardContent>
          </Card>
        )}

        <Tabs
          value={activeDocumentType}
          onValueChange={(v) => {
            setActiveDocumentType(v)
            const stages = getStagesForDocumentType(v)
            if (stages.length > 0) {
              setCurrentStage(stages[0].value)
            }
          }}
          className="w-full"
        >
          <TabsList className="mb-6">
            {documentTypes.map((doc) => (
              <TabsTrigger key={doc.id} value={doc.id}>
                {doc.shortName}
              </TabsTrigger>
            ))}
          </TabsList>

          {documentTypes.map((doc) => (
            <TabsContent key={doc.id} value={doc.id} className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{doc.name}</h2>
                  </div>

                  <Tabs value={currentStage} onValueChange={setCurrentStage}>
                    <TabsList className="mb-4">
                      {stagesWithCounts.map((stage) => (
                        <TabsTrigger key={stage.value} value={stage.value}>
                          {stage.label}
                          <Badge variant="secondary" className="ml-2">
                            {stage.count}
                          </Badge>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {stagesWithCounts.map((stage) => (
                      <TabsContent key={stage.value} value={stage.value}>
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>醫學會名稱</TableHead>
                                <TableHead>上傳日期</TableHead>
                                <TableHead>最後更新</TableHead>
                                <TableHead>當前階段</TableHead>
                                <TableHead className="text-right">操作</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredSubmissions.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    沒有符合條件的資料
                                  </TableCell>
                                </TableRow>
                              ) : (
                                filteredSubmissions.map((submission, index) => (
                                  <TableRow
                                    key={submission.societyId}
                                    className={!submission.uploaded ? "bg-gray-50" : ""}
                                  >
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-2">
                                        {!submission.uploaded && <AlertCircle className="w-4 h-4 text-gray-400" />}
                                        {submission.society.name}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {submission.uploaded ? (
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                          <Clock className="w-4 h-4" />
                                          {submission.uploadedDate}
                                        </div>
                                      ) : (
                                        <span className="text-sm text-gray-400">未上傳</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {submission.uploaded ? (
                                        <div className="text-sm text-gray-600">{submission.lastUpdated}</div>
                                      ) : (
                                        <span className="text-sm text-gray-400">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {submission.uploaded ? (
                                    <Badge className={getStageColors()[submission.stage]}>
                                          {stagesWithCounts.find((s) => s.value === submission.stage)?.label}
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-300">
                                          待上傳
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {submission.uploaded ? (
                                        <Button asChild size="sm">
                                          <Link
                                            href={`/review/${submission.societyId}`}
                                            className="flex items-center gap-2"
                                          >
                                            檢視審查
                                            <ChevronRight className="w-4 h-4" />
                                          </Link>
                                        </Button>
                                      ) : (
                                        <span className="text-sm text-gray-400">等待醫學會上傳</span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* 推進階段確認 Dialog */}
        <Dialog open={showAdvanceDialog} onOpenChange={setShowAdvanceDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>推進至下一階段</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  即將推進 <span className="font-medium">{documentTypes.find((d) => d.id === activeDocumentType)?.name}</span> 至{" "}
                  <span className="font-medium">{nextStageLabel}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  推進後，所有案件將統一進入下一階段。各醫學會將無法在此階段再進行修改。
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">目前各階段統計</p>
                {stagesWithCounts.map((stage) => (
                  <div key={stage.value} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{stage.label}</span>
                    <Badge variant="outline" className="bg-white">
                      {stage.count} 件
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowAdvanceDialog(false)}>
                取消
              </Button>
              <Button onClick={handleAdvanceStage} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
                <ArrowRight className="h-4 w-4" />
                確認推進
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
