"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  Users,
} from "lucide-react"
import Link from "next/link"

const documentCategories = [
  { value: "all", label: "全部類型" },
  { value: "training-plan", label: "訓練計畫基準" },
  { value: "course", label: "課程基準" },
  { value: "evaluation", label: "評核標準" },
  { value: "quota", label: "容額分配原則" },
  { value: "guidelines", label: "精進指南" },
  { value: "review-principles", label: "甄審原則" },
]

const reviewStages = [
  { value: "pending", label: "待審查", count: 12 },
  { value: "group-review", label: "分組審查", count: 5 },
  { value: "rrc-review", label: "RRC大會審核", count: 3 },
  { value: "pending-announce", label: "待公告", count: 2 },
  { value: "announced", label: "已公告", count: 45 },
]

const submissions = [
  {
    id: 1,
    specialty: "內科醫學會",
    documentType: "訓練計畫基準",
    documentTypeValue: "training-plan",
    submittedDate: "2025-03-01",
    lastUpdated: "2025-03-01",
    stage: "pending",
    hasChange: true,
    reviewer: null,
  },
  {
    id: 2,
    specialty: "外科醫學會",
    documentType: "訓練課程基準",
    documentTypeValue: "course",
    submittedDate: "2025-02-28",
    lastUpdated: "2025-03-02",
    stage: "group-review",
    hasChange: true,
    reviewer: "張委員",
  },
  {
    id: 3,
    specialty: "兒科醫學會",
    documentType: "評核標準",
    documentTypeValue: "evaluation",
    submittedDate: "2025-02-25",
    lastUpdated: "2025-02-28",
    stage: "rrc-review",
    hasChange: false,
    reviewer: "李委員",
  },
  {
    id: 4,
    specialty: "婦產科醫學會",
    documentType: "容額分配原則",
    documentTypeValue: "quota",
    submittedDate: "2025-02-20",
    lastUpdated: "2025-02-25",
    stage: "pending-announce",
    hasChange: true,
    reviewer: "王委員",
  },
  {
    id: 5,
    specialty: "骨科醫學會",
    documentType: "精進指南",
    documentTypeValue: "guidelines",
    submittedDate: "2025-02-15",
    lastUpdated: "2025-02-20",
    stage: "announced",
    hasChange: false,
    reviewer: "陳委員",
  },
  {
    id: 6,
    specialty: "神經外科醫學會",
    documentType: "甄審原則",
    documentTypeValue: "review-principles",
    submittedDate: "2025-02-10",
    lastUpdated: "2025-02-15",
    stage: "announced",
    hasChange: true,
    reviewer: "林委員",
  },
  {
    id: 7,
    specialty: "泌尿科醫學會",
    documentType: "訓練計畫基準",
    documentTypeValue: "training-plan",
    submittedDate: "2025-03-02",
    lastUpdated: "2025-03-02",
    stage: "pending",
    hasChange: true,
    reviewer: null,
  },
  {
    id: 8,
    specialty: "眼科醫學會",
    documentType: "訓練課程基準",
    documentTypeValue: "course",
    submittedDate: "2025-03-01",
    lastUpdated: "2025-03-01",
    stage: "pending",
    hasChange: false,
    reviewer: null,
  },
]

const stageConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof Clock }
> = {
  pending: { label: "待審查", variant: "secondary", icon: Clock },
  "group-review": { label: "分組審查", variant: "default", icon: Users },
  "rrc-review": { label: "RRC大會審核", variant: "default", icon: FileText },
  "pending-announce": { label: "待公告", variant: "outline", icon: AlertCircle },
  announced: { label: "已公告", variant: "default", icon: CheckCircle2 },
  returned: { label: "退回補正", variant: "destructive", icon: XCircle },
}

export default function ReviewPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStage, setSelectedStage] = useState("pending")

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.specialty.includes(searchQuery) || submission.documentType.includes(searchQuery)
    const matchesCategory =
      selectedCategory === "all" || submission.documentTypeValue === selectedCategory
    const matchesStage = submission.stage === selectedStage
    return matchesSearch && matchesCategory && matchesStage
  })

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">審查專區</h1>
        <p className="text-muted-foreground">
          審查各專科醫學會提交之文件與容額申請
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {reviewStages.map((stage) => {
          const stageInfo = stageConfig[stage.value]
          const StageIcon = stageInfo?.icon || Clock
          return (
            <Card
              key={stage.value}
              className={`cursor-pointer transition-all ${
                selectedStage === stage.value ? "ring-2 ring-primary" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedStage(stage.value)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stage.label}</p>
                    <p className="text-2xl font-bold">{stage.count}</p>
                  </div>
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      selectedStage === stage.value ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <StageIcon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">規範文件審查</TabsTrigger>
          <TabsTrigger value="quota">容額審查</TabsTrigger>
          <TabsTrigger value="external-quota">外加容額審查</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜尋醫學會或文件類型..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="文件類型" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {reviewStages.find((s) => s.value === selectedStage)?.label} - 文件列表
              </CardTitle>
              <CardDescription>共 {filteredSubmissions.length} 筆資料</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>專科醫學會</TableHead>
                    <TableHead>文件類型</TableHead>
                    <TableHead>提交日期</TableHead>
                    <TableHead>異動狀態</TableHead>
                    <TableHead>審查階段</TableHead>
                    <TableHead>審查委員</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => {
                    const stageInfo = stageConfig[submission.stage]
                    const StageIcon = stageInfo.icon
                    return (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.specialty}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{submission.documentType}</Badge>
                        </TableCell>
                        <TableCell>{submission.submittedDate}</TableCell>
                        <TableCell>
                          {submission.hasChange ? (
                            <Badge variant="default" className="bg-accent">
                              有變更
                            </Badge>
                          ) : (
                            <Badge variant="secondary">無變更</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={stageInfo.variant} className="gap-1">
                            <StageIcon className="h-3 w-3" />
                            {stageInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{submission.reviewer || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/review/${submission.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="h-4 w-4" />
                              審查
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {filteredSubmissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        目前沒有符合條件的審查案件
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quota">
          <Card>
            <CardHeader>
              <CardTitle>容額審查</CardTitle>
              <CardDescription>審核各專科訓練容額分配</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>容額審查功能開發中</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="external-quota">
          <Card>
            <CardHeader>
              <CardTitle>外加容額審查</CardTitle>
              <CardDescription>審核外加容額申請與成果報告</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>外加容額審查功能開發中</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

