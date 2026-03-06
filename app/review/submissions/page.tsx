"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Clock, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ReviewSimpleNav } from "@/components/review/simple-nav"
import {
  getDocumentSubmissions,
  getDocumentTypes,
  getSocieties,
  getStageColors,
  getStagesForDocumentType,
} from "@/lib/mock/review-submissions"

export default function SubmissionsReviewPage() {
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDocumentType, setActiveDocumentType] = useState("screening-principle")
  const [currentStage, setCurrentStage] = useState("pending-review")

  const documentTypes = getDocumentTypes()
  const allStagesForActiveType = getStagesForDocumentType(activeDocumentType)
  const currentDocumentSubmissions = getDocumentSubmissions(activeDocumentType)
  const societies = getSocieties()

  const filteredSubmissions = currentDocumentSubmissions
    .map((submission) => ({
      ...submission,
      society: societies.find((s) => s.id === submission.societyId)!,
    }))
    .filter((submission) => submission.society.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((submission) => submission.stage === currentStage)
    .sort((a, b) => {
      // 已上傳的排在前面
      if (a.uploaded && !b.uploaded) return -1
      if (!a.uploaded && b.uploaded) return 1
      return 0
    })

  const stagesWithCounts = allStagesForActiveType.map((stage) => ({
    ...stage,
    count: currentDocumentSubmissions.filter((s) => s.stage === stage.value).length,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewSimpleNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">填報審查</h1>
            <p className="text-sm text-gray-500 mt-1">以文件類型為單位檢視各醫學會的填報狀態並進行審查</p>
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
                                            href={`/review/submissions/${doc.id}/${submission.societyId}`}
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
      </div>
    </div>
  )
}
