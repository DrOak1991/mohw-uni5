"use client"

import { useState } from "react"
import { ReviewSimpleNav } from "@/components/review/simple-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockSocieties = [
  {
    id: "1",
    name: "台灣內科醫學會",
    year: "115 年度",
    submittedDate: "2025-01-15",
    stage: "pending" as const,
    mohwReviewed: false, // 醫事司是否完成審查
    mohwiReviewed: false, // 醫策會是否完成審查
  },
  {
    id: "2",
    name: "台灣外科醫學會",
    year: "115 年度",
    submittedDate: "2025-01-18",
    stage: "group-review" as const,
    mohwReviewed: true,
    mohwiReviewed: true,
  },
  {
    id: "3",
    name: "台灣小兒科醫學會",
    year: "115 年度",
    submittedDate: "2025-01-20",
    stage: "main-review" as const,
    mohwReviewed: false,
    mohwiReviewed: false,
  },
  {
    id: "4",
    name: "台灣婦產科醫學會",
    year: "115 年度",
    submittedDate: "2025-01-10",
    stage: "upload-pending" as const,
    mohwReviewed: false,
    mohwiReviewed: false,
  },
]

const stageConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "待審查" },
  "group-review": { color: "bg-blue-100 text-blue-800 border-blue-200", label: "分組會議審核" },
  "main-review": { color: "bg-purple-100 text-purple-800 border-purple-200", label: "RRC 大會審核" },
  "upload-pending": { color: "bg-green-100 text-green-800 border-green-200", label: "待公告" },
}

export default function HospitalQuotaReviewPage() {
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState<string>("all")

  const filteredSocieties = mockSocieties.filter((society) => {
    const matchesSearch = society.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = stageFilter === "all" || society.stage === stageFilter
    return matchesSearch && matchesStage
  })

  const pendingSocieties = filteredSocieties.filter((s) => s.stage === "pending")
  const groupReviewSocieties = filteredSocieties.filter((s) => s.stage === "group-review")
  const mainReviewSocieties = filteredSocieties.filter((s) => s.stage === "main-review")
  const uploadPendingSocieties = filteredSocieties.filter((s) => s.stage === "upload-pending")

  const renderSocietyTable = (societies: typeof mockSocieties) => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>醫學會名稱</TableHead>
              <TableHead>年度</TableHead>
              <TableHead>送件日期</TableHead>
              <TableHead>審查進度</TableHead>
              <TableHead>審查階段</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {societies.length > 0 ? (
              societies.map((society) => (
                <TableRow key={society.id}>
                  <TableCell className="font-medium">{society.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {society.year}
                    </Badge>
                  </TableCell>
                  <TableCell>{society.submittedDate}</TableCell>
                  <TableCell>
                    {society.stage === "pending" && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className={society.mohwReviewed ? "text-green-600" : "text-gray-400"}>
                          醫事司 {society.mohwReviewed ? "✓" : "⏳"}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className={society.mohwiReviewed ? "text-green-600" : "text-gray-400"}>
                          醫策會 {society.mohwiReviewed ? "✓" : "⏳"}
                        </span>
                      </div>
                    )}
                    {society.stage !== "pending" && <span className="text-sm text-gray-500">-</span>}
                  </TableCell>
                  <TableCell>
                    <Badge className={stageConfig[society.stage].color}>{stageConfig[society.stage].label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm">
                      <Link href={`/review/hospital-quota/${society.id}`} className="flex items-center gap-2">
                        檢視審查
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                  目前沒有符合條件的醫學會
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewSimpleNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">醫院容額分配審查</h1>
            <p className="text-sm text-gray-500 mt-1">審查各醫學會提交的醫院訓練容額分配申請</p>
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
              <div className="flex items-center gap-4">
                <Input
                  placeholder="搜尋醫學會名稱..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="審查階段" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部階段</SelectItem>
                    <SelectItem value="pending">待審查</SelectItem>
                    <SelectItem value="group-review">分組會議審核</SelectItem>
                    <SelectItem value="main-review">RRC 大會審核</SelectItem>
                    <SelectItem value="upload-pending">待公告</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-500 ml-auto">共 {filteredSocieties.length} 個醫學會</div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              待審查
              <Badge variant="secondary" className="ml-1">
                {pendingSocieties.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="group-review" className="flex items-center gap-2">
              分組會議審核
              <Badge variant="secondary" className="ml-1">
                {groupReviewSocieties.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="main-review" className="flex items-center gap-2">
              RRC 大會審核
              <Badge variant="secondary" className="ml-1">
                {mainReviewSocieties.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="upload-pending" className="flex items-center gap-2">
              待公告
              <Badge variant="secondary" className="ml-1">
                {uploadPendingSocieties.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">{renderSocietyTable(pendingSocieties)}</TabsContent>

          <TabsContent value="group-review">{renderSocietyTable(groupReviewSocieties)}</TabsContent>

          <TabsContent value="main-review">{renderSocietyTable(mainReviewSocieties)}</TabsContent>

          <TabsContent value="upload-pending">{renderSocietyTable(uploadPendingSocieties)}</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
