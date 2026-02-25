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

const documentTypes = [
  
  { id: "hospital-accreditation", name: "專科醫師訓練計畫認定基準", shortName: "計畫認定基準" },
  { id: "training-curriculum", name: "訓練課程基準", shortName: "訓練課程基準" },
  { id: "evaluation-standards", name: "評核標準與評核表", shortName: "評核標準" },
  { id: "quota-allocation", name: "留存容額分配原則", shortName: "容額分配原則" },
  { id: "improvement-guide", name: "精進指南", shortName: "精進指南" },
  { id: "screening-principle", name: "甄審原則", shortName: "甄審原則" },
]

const stagesByDocumentType: Record<string, Array<{ value: string; label: string; count?: number }>> = {
  "screening-principle": [
    { value: "pending-review", label: "待審查" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
  "hospital-accreditation": [
    { value: "pending-review", label: "待審查" },
    { value: "group-meeting", label: "分組會議審核" },
    { value: "rrc-meeting", label: "RRC 大會審核" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
  "training-curriculum": [
    { value: "pending-review", label: "待審查" },
    { value: "group-meeting", label: "分組會議審核" },
    { value: "rrc-meeting", label: "RRC 大會審核" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
  "evaluation-standards": [
    { value: "pending-review", label: "待審查" },
    { value: "group-meeting", label: "分組會議審核" },
    { value: "rrc-meeting", label: "RRC 大會審核" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
  "quota-allocation": [
    { value: "pending-review", label: "待審查" },
    { value: "group-meeting", label: "分組會議審核" },
    { value: "rrc-meeting", label: "RRC 大會審核" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
  "improvement-guide": [
    { value: "pending-review", label: "待審查" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
}

const mockSocieties = [
  { id: "1", name: "台灣內科醫學會" },
  { id: "2", name: "台灣外科醫學會" },
  { id: "3", name: "台灣小兒科醫學會" },
  { id: "4", name: "台灣婦產科醫學會" },
  { id: "5", name: "台灣骨科醫學會" },
  { id: "6", name: "台灣眼科醫學會" },
  { id: "7", name: "台灣耳鼻喉科醫學會" },
  { id: "8", name: "台灣皮膚科醫學會" },
  { id: "9", name: "台灣泌尿科醫學會" },
  { id: "10", name: "台灣神經科醫學會" },
  { id: "11", name: "台灣精神醫學會" },
  { id: "12", name: "台灣復健醫學會" },
  { id: "13", name: "台灣麻醉醫學會" },
  { id: "14", name: "台灣急診醫學會" },
  { id: "15", name: "台灣家庭醫學會" },
  { id: "16", name: "台灣病理學會" },
  { id: "17", name: "台灣放射線醫學會" },
  { id: "18", name: "台灣核醫學會" },
  { id: "19", name: "台灣整形外科醫學會" },
  { id: "20", name: "台灣職業醫學會" },
  { id: "21", name: "台灣老年醫學會" },
  { id: "22", name: "台灣安寧緩和醫學會" },
  { id: "23", name: "台灣重症醫學會" },
]

const generateMockSubmissionsByStage = (stages: string[]) => {
  return mockSocieties.map((society, index) => {
    const stageIndex = index % (stages.length + 1) // +1 to include "not-uploaded" cases

    // 每5個醫學會有1個是未上傳
    if (index % 5 === 0) {
      return {
        societyId: society.id,
        stage: "pending-review",
        uploaded: false,
        uploadedDate: null,
        lastUpdated: null,
      }
    }

    return {
      societyId: society.id,
      stage: stages[stageIndex % stages.length],
      uploaded: true,
      uploadedDate: `2025-01-${String(5 + index).padStart(2, "0")}`,
      lastUpdated: `2025-01-${String(10 + index).padStart(2, "0")}`,
    }
  })
}

const mockDocumentSubmissions: Record<
  string,
  Array<{
    societyId: string
    stage: string
    uploaded: boolean
    uploadedDate: string | null
    lastUpdated: string | null
  }>
> = {
  "screening-principle": generateMockSubmissionsByStage(["pending-review", "pending-announcement", "announced"]),
  "hospital-accreditation": generateMockSubmissionsByStage([
    "pending-review",
    "group-meeting",
    "rrc-meeting",
    "pending-announcement",
    "announced",
  ]),
  "training-curriculum": generateMockSubmissionsByStage([
    "pending-review",
    "group-meeting",
    "rrc-meeting",
    "pending-announcement",
    "announced",
  ]),
  "evaluation-standards": generateMockSubmissionsByStage([
    "pending-review",
    "group-meeting",
    "rrc-meeting",
    "pending-announcement",
    "announced",
  ]),
  "quota-allocation": generateMockSubmissionsByStage([
    "pending-review",
    "group-meeting",
    "rrc-meeting",
    "pending-announcement",
    "announced",
  ]),
  "improvement-guide": generateMockSubmissionsByStage(["pending-review", "pending-announcement", "announced"]),
}

const stageColors: Record<string, string> = {
  "pending-review": "bg-blue-100 text-blue-800 border-blue-200",
  "group-meeting": "bg-purple-100 text-purple-800 border-purple-200",
  "rrc-meeting": "bg-pink-100 text-pink-800 border-pink-200",
  "pending-announcement": "bg-amber-100 text-amber-800 border-amber-200",
  announced: "bg-green-100 text-green-800 border-green-200",
}

export default function SubmissionsReviewPage() {
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDocumentType, setActiveDocumentType] = useState("screening-principle")
  const [currentStage, setCurrentStage] = useState("pending-review")

  const currentDocumentSubmissions = mockDocumentSubmissions[activeDocumentType] || []
  const currentStages = stagesByDocumentType[activeDocumentType] || []

  const filteredSubmissions = currentDocumentSubmissions
    .map((submission) => ({
      ...submission,
      society: mockSocieties.find((s) => s.id === submission.societyId)!,
    }))
    .filter((submission) => submission.society.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((submission) => submission.stage === currentStage)
    .sort((a, b) => {
      // 已上傳的排在前面
      if (a.uploaded && !b.uploaded) return -1
      if (!a.uploaded && b.uploaded) return 1
      return 0
    })

  const stagesWithCounts = currentStages.map((stage) => ({
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
            setCurrentStage(stagesByDocumentType[v][0].value)
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
                                        <Badge className={stageColors[submission.stage]}>
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
