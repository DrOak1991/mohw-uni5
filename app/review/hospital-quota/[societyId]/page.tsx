"use client"

import { useState, Fragment } from "react"
import { useRouter } from 'next/navigation'
import { ReviewSimpleNav } from "@/components/review/simple-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Edit3, Printer, MessageSquare, Upload, ChevronDown, ChevronUp, X, FileText } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const mockSocieties = [
  {
    id: "1",
    name: "台灣內科醫學會",
    year: "115 年度",
    submittedDate: "2025-01-15",
    stage: "pending" as const,
    mohwReviewed: true,
    mohwiReviewed: false,
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
    mohwReviewed: true,
    mohwiReviewed: true,
  },
  {
    id: "4",
    name: "台灣婦產科醫學會",
    year: "115 年度",
    submittedDate: "2025-01-10",
    stage: "upload-pending" as const,
    mohwReviewed: true,
    mohwiReviewed: true,
  },
]

const mockHospitals = [
  {
    id: "1",
    name: "台大醫院",
    status: "效期屆滿" as const,
    validUntil: "2026/7/31",
    extensionYears: "4",
    quotaLimit: 50,
    currentYearQuota: 45,
    previousYearQuota: 42,
    teachingHospital: "合格" as const,
    comment: "",
  },
  {
    id: "2",
    name: "榮民總醫院",
    status: "新申請" as const,
    validUntil: "2026/7/31",
    extensionYears: "3",
    quotaLimit: 40,
    currentYearQuota: 38,
    previousYearQuota: 35,
    teachingHospital: "合格" as const,
    comment: "",
  },
  {
    id: "3",
    name: "長庚醫院",
    status: "效期屆滿" as const,
    validUntil: "2024/7/31",
    extensionYears: "4",
    quotaLimit: 35,
    currentYearQuota: 40,
    previousYearQuota: 30,
    teachingHospital: "合格" as const,
    comment: "",
  },
  {
    id: "4",
    name: "中國醫藥大學附醫",
    status: "效期屆滿" as const,
    validUntil: "2026/7/31",
    extensionYears: "4",
    quotaLimit: 45,
    currentYearQuota: 35,
    previousYearQuota: 35,
    teachingHospital: "不合格" as const,
    comment: "",
  },
]

const mockUnqualifiedHospitals = [
  {
    id: "1",
    name: "新光醫院",
    reason: "未符合訓練醫院認證基準第3條：專任主治醫師人數不足",
  },
]

const calculateExtensionDate = (years: string, baseDate = "2025/7/31") => {
  if (!years) return ""
  const date = new Date(baseDate)
  date.setFullYear(date.getFullYear() + Number.parseInt(years))
  return date.toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "/")
}

export default function HospitalQuotaReviewDetailPage({ params }: { params: { societyId: string } }) {
  const router = useRouter()

  const [currentUserOrg] = useState<"mohw" | "mohwi">("mohw")
  const [activeCommentTab, setActiveCommentTab] = useState<"mohw" | "mohwi">("mohw")
  const [mohwComments, setMohwComments] = useState<Record<string, string>>({})
  const [mohwiComments, setMohwiComments] = useState<Record<string, string>>({})
  const [mohwOverallFeedback, setMohwOverallFeedback] = useState("")
  const [mohwiOverallFeedback, setMohwiOverallFeedback] = useState("")
  const [overallFeedback, setOverallFeedback] = useState("")
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [selectedHospitalForComment, setSelectedHospitalForComment] = useState<string | null>(null)
  const [tempComment, setTempComment] = useState("")
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [editingHospitalId, setEditingHospitalId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    extensionYears: "",
    quotaLimit: 0,
    currentYearQuota: 0,
    comment: "",
  })
  const [pendingReviewComments, setPendingReviewComments] = useState<Record<string, string>>({})
  const [groupReviewComments, setGroupReviewComments] = useState<Record<string, string>>({})
  const [mainReviewComments, setMainReviewComments] = useState<Record<string, string>>({})
  const [pendingReviewFeedback, setPendingReviewFeedback] = useState("")
  const [groupReviewFeedback, setGroupReviewFeedback] = useState("分組會議已審查完成，建議部分醫院調整容額配置。")
  const [rrcReviewFeedback, setRrcReviewFeedback] = useState("")
  const [originalHospitals] = useState(mockHospitals)
  const [groupModifiedHospitals, setGroupModifiedHospitals] = useState<typeof mockHospitals>(mockHospitals)
  const [showVersionComparison, setShowVersionComparison] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [finalResult, setFinalResult] = useState<"approved" | "rejected" | "">("")
  const [hospitals, setHospitals] = useState(mockHospitals)
  const [unqualifiedHospitals] = useState(mockUnqualifiedHospitals)

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [announcementSummary, setAnnouncementSummary] = useState("")
  const [groupReviewExpanded, setGroupReviewExpanded] = useState(false)
  const [rrcReviewExpanded, setRrcReviewExpanded] = useState(false)

  const society = mockSocieties.find((s) => s.id === params.societyId)

  if (!society) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReviewSimpleNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">找不到該醫學會</h1>
            <Button onClick={() => router.back()}>返回列表</Button>
          </div>
        </div>
      </div>
    )
  }

  const reviewedCount = hospitals.filter((h) => h.comment).length
  const totalCount = hospitals.length

  const handleAddComment = (hospitalId: string) => {
    setSelectedHospitalForComment(hospitalId)
    const hospital = hospitals.find((h) => h.id === hospitalId)
    setTempComment(hospital?.comment || "")
    setCommentDialogOpen(true)
  }

  const handleSaveComment = () => {
    if (!selectedHospitalForComment) return
    setHospitals(hospitals.map((h) => (h.id === selectedHospitalForComment ? { ...h, comment: tempComment } : h)))
    setCommentDialogOpen(false)
    setSelectedHospitalForComment(null)
    setTempComment("")
  }

  const handleMarkAsNeedRevision = () => {
    alert("已標記為待更改，案件將返還給醫學會")
    router.back()
  }

  const handleMarkAsRRCReview = () => {
    alert("已標記為待 RRC 審查")
    router.back()
  }

  const handleStartReview = (hospital: (typeof mockHospitals)[0]) => {
    setEditingHospitalId(hospital.id)
    setEditForm({
      extensionYears: hospital.extensionYears,
      quotaLimit: hospital.quotaLimit,
      currentYearQuota: hospital.currentYearQuota,
      comment: hospital.comment,
    })
  }

  const handleCompleteReview = () => {
    if (!editingHospitalId) return
    setHospitals(
      hospitals.map((h) =>
        h.id === editingHospitalId
          ? {
              ...h,
              extensionYears: editForm.extensionYears,
              quotaLimit: editForm.quotaLimit,
              currentYearQuota: editForm.currentYearQuota,
              comment: editForm.comment,
            }
          : h,
      ),
    )
    setEditingHospitalId(null)
  }

  const handleCancelReview = () => {
    setEditingHospitalId(null)
  }

  const handlePrintAll = () => {
    window.print()
  }

  const handleCompleteAllReviews = () => {
    alert("已儲存審查結果")
    router.back()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleUploadResult = () => {
    if (!finalResult) {
      alert("請選擇最終審查結果")
      return
    }
    alert(`已上傳最終審查結果：${finalResult === "approved" ? "審核通過" : "不通過"}`)
    setUploadDialogOpen(false)
    router.back()
  }

  const toggleCommentExpand = (hospitalId: string) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(hospitalId)) {
      newExpanded.delete(hospitalId)
    } else {
      newExpanded.add(hospitalId)
    }
    setExpandedComments(newExpanded)
  }

  const getCurrentPhaseComments = (reviewPhase: "pending" | "group" | "main") => {
    if (reviewPhase === "group") return groupReviewComments
    if (reviewPhase === "main") return mainReviewComments
    return pendingReviewComments
  }

  const setCurrentPhaseComments = (comments: Record<string, string>, reviewPhase: "pending" | "group" | "main") => {
    if (reviewPhase === "group") setGroupReviewComments(comments)
    else if (reviewPhase === "main") setMainReviewComments(comments)
    else setPendingReviewComments(comments)
  }

  // The following line was the cause of the lint error:
  // const allReviewed = hospitals.every((h) => getCurrentPhaseComments()[h.id])
  // It's removed as the reviewPhase variable is no longer needed.

  if (society.stage === "pending") {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReviewSimpleNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">醫院容額分配審查 - {society.name}</h1>
              <Badge variant="outline" className="bg-blue-500 text-white">
                {society.year}
              </Badge>
              <Badge className="bg-gray-100 text-gray-800">待審查</Badge>
            </div>
            <Button variant="outline" onClick={handlePrintAll}>
              <Printer className="w-4 h-4 mr-2" />
              列印全部
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-gray-500">送件日期：{society.submittedDate}</span>
          </div>

          {/* CHANGE: 加入雙單位審查進度卡片 */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">雙單位審查進度</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-lg border-2 ${society.mohwReviewed ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">醫事司審查</span>
                    {society.mohwReviewed ? (
                      <Badge className="bg-green-600">✓ 已完成</Badge>
                    ) : (
                      <Badge className="bg-yellow-500">⏳ 進行中</Badge>
                    )}
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg border-2 ${society.mohwiReviewed ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">醫策會審查</span>
                    {society.mohwiReviewed ? (
                      <Badge className="bg-green-600">✓ 已完成</Badge>
                    ) : (
                      <Badge className="bg-yellow-500">⏳ 進行中</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">訓練醫院名單與容額分配</h2>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">序號</TableHead>
                      <TableHead>醫院名稱</TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead>效期</TableHead>
                      <TableHead>延長效期</TableHead>
                      <TableHead>容額上限</TableHead>
                      <TableHead>前年度核定容額</TableHead>
                      <TableHead>本年度容額</TableHead>
                      <TableHead>教學醫院</TableHead>
                      <TableHead>評論</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hospitals.map((hospital, index) => (
                      <Fragment key={hospital.id}>
                        <TableRow>
                          <TableCell className="text-center">{index + 1}</TableCell>
                          <TableCell className="font-medium">{hospital.name}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                hospital.status === "效期屆滿"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {hospital.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">有效至 {hospital.validUntil}</TableCell>
                          <TableCell className="text-sm">
                            {hospital.extensionYears} 年
                            <span className="text-xs text-gray-500 ml-1">
                              (至 {calculateExtensionDate(hospital.extensionYears, hospital.validUntil)})
                            </span>
                          </TableCell>
                          <TableCell>{hospital.quotaLimit}</TableCell>
                          <TableCell>{hospital.previousYearQuota}</TableCell>
                          <TableCell>{hospital.currentYearQuota}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                hospital.teachingHospital === "合格"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {hospital.teachingHospital}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {hospital.comment ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCommentExpand(hospital.id)}
                                className="text-blue-600"
                              >
                                {expandedComments.has(hospital.id) ? (
                                  <ChevronUp className="w-4 h-4 mr-1" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 mr-1" />
                                )}
                                檢視評論
                              </Button>
                            ) : (
                              <span className="text-sm text-gray-400">無</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button variant="outline" size="sm" onClick={() => handleAddComment(hospital.id)}>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              {hospital.comment ? "編輯" : "新增"}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedComments.has(hospital.id) && hospital.comment && (
                          <TableRow>
                            <TableCell colSpan={11} className="bg-blue-50 border-t-0">
                              <div className="py-3 px-4">
                                <p className="text-sm font-medium text-gray-700 mb-1">評論內容：</p>
                                <p className="text-sm text-gray-600">{hospital.comment}</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">不合格醫院名單</h2>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">序號</TableHead>
                      <TableHead>醫院名稱</TableHead>
                      <TableHead>不合格原因</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unqualifiedHospitals.map((hospital, index) => (
                      <TableRow key={hospital.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="font-medium">{hospital.name}</TableCell>
                        <TableCell>{hospital.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* CHANGE: 整體申請案件回饋改用 Tabs 區分兩個單位 */}
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeCommentTab} onValueChange={(v) => setActiveCommentTab(v as "mohw" | "mohwi")}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="mohw">醫事司評論</TabsTrigger>
                    <TabsTrigger value="mohwi">醫策會評論</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mohw">
                    {currentUserOrg === "mohw" ? (
                      <div>
                        <Label className="text-gray-700 font-medium mb-2 block">整體申請案件回饋</Label>
                        <Textarea
                          placeholder="請輸入醫事司針對整個申請案件的回饋意見..."
                          value={mohwOverallFeedback}
                          onChange={(e) => setMohwOverallFeedback(e.target.value)}
                          rows={4}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">{mohwOverallFeedback || "醫事司尚未提交評論"}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="mohwi">
                    {currentUserOrg === "mohwi" ? (
                      <div>
                        <Label className="text-gray-700 font-medium mb-2 block">整體申請案件回饋</Label>
                        <Textarea
                          placeholder="請輸入醫策會針對整個申請案件的回饋意見..."
                          value={mohwiOverallFeedback}
                          onChange={(e) => setMohwiOverallFeedback(e.target.value)}
                          rows={4}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">{mohwiOverallFeedback || "醫策會尚未提交評論"}</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* CHANGE: 按鈕改為統一的「提交至分組會議」和「標記為待更改」 */}
                <div className="flex items-center justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={handleMarkAsNeedRevision}>
                    標記為待更改
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleMarkAsRRCReview}>
                    提交至分組會議
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增評論</DialogTitle>
              <DialogDescription>針對此醫院留下評論，協助醫學會調整申請內容</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="請輸入評論內容..."
                value={tempComment}
                onChange={(e) => setTempComment(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCommentDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSaveComment}>儲存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // NEW: group-review stage handling
  if (society.stage === "group-review") {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReviewSimpleNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">醫院容額分配審查 - {society.name}</h1>
              <Badge variant="outline" className="bg-blue-500 text-white">
                {society.year}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">分組會議審核</Badge>
            </div>
            <Button variant="outline" onClick={handlePrintAll}>
              <Printer className="w-4 h-4 mr-2" />
              列印全部
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-gray-500">送件日期：{society.submittedDate}</span>
          </div>

          {pendingReviewFeedback && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">待審查階段回饋</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{pendingReviewFeedback}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-4">訓練醫院名單與容額分配</h2>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">序號</TableHead>
                    <TableHead>醫院名稱</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>效期</TableHead>
                    <TableHead>延長效期</TableHead>
                    <TableHead>容額上限</TableHead>
                    <TableHead>前年度核定容額</TableHead>
                    <TableHead>本年度容額</TableHead>
                    <TableHead>教學醫院</TableHead>
                    <TableHead className="text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitals.map((hospital, index) => {
                    const isEditing = editingHospitalId === hospital.id

                    return (
                      <Fragment key={hospital.id}>
                        <TableRow>
                          <TableCell className="text-center">{index + 1}</TableCell>
                          <TableCell className="font-medium">{hospital.name}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                hospital.status === "效期屆滿"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {hospital.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">有效至 {hospital.validUntil}</TableCell>
                          <TableCell className="text-sm">
                            {isEditing ? (
                              <Select
                                value={editForm.extensionYears}
                                onValueChange={(value) => setEditForm({ ...editForm, extensionYears: value })}
                              >
                                <SelectTrigger className="bg-white w-[180px]">
                                  <SelectValue placeholder="選擇年數" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">
                                    1 年（至 {calculateExtensionDate("1", hospital.validUntil)}）
                                  </SelectItem>
                                  <SelectItem value="2">
                                    2 年（至 {calculateExtensionDate("2", hospital.validUntil)}）
                                  </SelectItem>
                                  <SelectItem value="3">
                                    3 年（至 {calculateExtensionDate("3", hospital.validUntil)}）
                                  </SelectItem>
                                  <SelectItem value="4">
                                    4 年（至 {calculateExtensionDate("4", hospital.validUntil)}）
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <>
                                {hospital.extensionYears} 年
                                <span className="text-xs text-gray-500 ml-1">
                                  (至 {calculateExtensionDate(hospital.extensionYears, hospital.validUntil)})
                                </span>
                              </>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editForm.quotaLimit}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, quotaLimit: Number.parseInt(e.target.value) })
                                }
                                className="bg-white w-20"
                              />
                            ) : (
                              hospital.quotaLimit
                            )}
                          </TableCell>
                          <TableCell>{hospital.previousYearQuota}</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editForm.currentYearQuota}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, currentYearQuota: Number.parseInt(e.target.value) })
                                }
                                className="bg-white w-20"
                              />
                            ) : (
                              hospital.currentYearQuota
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                hospital.teachingHospital === "合格"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {hospital.teachingHospital}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {isEditing ? (
                              <div className="flex gap-2 justify-center">
                                <Button variant="outline" size="sm" onClick={handleCancelReview}>
                                  取消
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={handleCompleteReview}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  完成
                                </Button>
                              </div>
                            ) : (
                              <Button variant="outline" size="sm" onClick={() => handleStartReview(hospital)}>
                                <Edit3 className="w-4 h-4 mr-2" />
                                編輯
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                        {isEditing && (
                          <TableRow>
                            <TableCell colSpan={10} className="bg-blue-50 border-t-0">
                              <div className="py-3 px-4">
                                <Label className="text-gray-700 font-medium mb-2 block">審核評論</Label>
                                <Textarea
                                  value={editForm.comment}
                                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                  placeholder="請輸入針對此醫院的審核評論..."
                                  rows={3}
                                  className="bg-white"
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-4">不合格醫院名單</h2>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">序號</TableHead>
                    <TableHead>醫院名稱</TableHead>
                    <TableHead>不合格原因</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unqualifiedHospitals.map((hospital, index) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="font-medium">{hospital.name}</TableCell>
                      <TableCell>{hospital.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Label className="text-gray-700 font-medium mb-2 block">分組會議整體案件評論</Label>
              <Textarea
                value={groupReviewFeedback}
                onChange={(e) => setGroupReviewFeedback(e.target.value)}
                placeholder="請輸入分組會議針對整個申請案件的評論..."
                rows={6}
                className="w-full mb-3"
              />
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                上傳文件
              </Button>

              <div className="flex items-center justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleCompleteAllReviews}>
                  儲存進度
                </Button>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
                  不通過結案
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">通過移交 RRC</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // NEW: main-review stage handling
  if (society.stage === "main-review") {
    return (
      <div className="min-h-screen bg-gray-50">
        <ReviewSimpleNav />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">醫院容額分配審查 - {society.name}</h1>
              <Badge variant="outline" className="bg-purple-500 text-white">
                {society.year}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">RRC 大會審核</Badge>
            </div>
            <Button variant="outline" onClick={handlePrintAll}>
              <Printer className="w-4 h-4 mr-2" />
              列印全部
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-gray-500">送件日期：{society.submittedDate}</span>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">版本比較</h3>
                <Button variant="outline" size="sm" onClick={() => setShowVersionComparison(!showVersionComparison)}>
                  {showVersionComparison ? "隱藏" : "顯示"}版本差異
                </Button>
              </div>
              {showVersionComparison && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">原始送件版本</h4>
                    <div className="bg-gray-50 p-3 rounded text-xs">
                      {originalHospitals.map((h) => (
                        <div key={h.id} className="mb-2 pb-2 border-b last:border-0">
                          <div className="font-medium">{h.name}</div>
                          <div className="text-gray-600">
                            延長效期: {h.extensionYears}年 | 容額上限: {h.quotaLimit} | 本年度容額: {h.currentYearQuota}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">分組會議修改版本</h4>
                    <div className="bg-blue-50 p-3 rounded text-xs">
                      {hospitals.map((h) => {
                        const original = originalHospitals.find((o) => o.id === h.id)
                        const hasChanges =
                          original &&
                          (original.extensionYears !== h.extensionYears ||
                            original.quotaLimit !== h.quotaLimit ||
                            original.currentYearQuota !== h.currentYearQuota)
                        return (
                          <div key={h.id} className="mb-2 pb-2 border-b last:border-0">
                            <div className="font-medium">{h.name}</div>
                            <div className={hasChanges ? "text-blue-700 font-medium" : "text-gray-600"}>
                              延長效期: {h.extensionYears}年 | 容額上限: {h.quotaLimit} | 本年度容額:{" "}
                              {h.currentYearQuota}
                              {hasChanges && <span className="ml-2 text-xs">(已修改)</span>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-4">訓練醫院名單與容額分配</h2>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">序號</TableHead>
                    <TableHead>醫院名稱</TableHead>
                    <TableHead>狀態</TableHead>
                    <TableHead>效期</TableHead>
                    <TableHead>延長效期</TableHead>
                    <TableHead>容額上限</TableHead>
                    <TableHead>前年度核定容額</TableHead>
                    <TableHead>本年度容額</TableHead>
                    <TableHead>教學醫院</TableHead>
                    <TableHead className="text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hospitals.map((hospital, index) => {
                    const isEditing = editingHospitalId === hospital.id
                    const originalHospital = originalHospitals.find((h) => h.id === hospital.id)
                    const groupHospital = groupModifiedHospitals.find((h) => h.id === hospital.id)
                    const showVersionDiff = isEditing

                    return (
                      <Fragment key={hospital.id}>
                        <TableRow>
                          <TableCell className="text-center">{index + 1}</TableCell>
                          <TableCell className="font-medium">{hospital.name}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                hospital.status === "效期屆滿"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {hospital.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">有效至 {hospital.validUntil}</TableCell>
                          <TableCell className="text-sm">
                            {isEditing ? (
                              <div>
                                <Select
                                  value={editForm.extensionYears}
                                  onValueChange={(value) => setEditForm({ ...editForm, extensionYears: value })}
                                >
                                  <SelectTrigger className="bg-white w-[180px]">
                                    <SelectValue placeholder="選擇年數" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">
                                      1 年（至 {calculateExtensionDate("1", hospital.validUntil)}）
                                    </SelectItem>
                                    <SelectItem value="2">
                                      2 年（至 {calculateExtensionDate("2", hospital.validUntil)}）
                                    </SelectItem>
                                    <SelectItem value="3">
                                      3 年（至 {calculateExtensionDate("3", hospital.validUntil)}）
                                    </SelectItem>
                                    <SelectItem value="4">
                                      4 年（至 {calculateExtensionDate("4", hospital.validUntil)}）
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {showVersionDiff && originalHospital && groupHospital && (
                                  <div className="mt-1 text-xs space-y-0.5">
                                    <div className="text-gray-500">原始：{originalHospital.extensionYears} 年</div>
                                    <div
                                      className={
                                        groupHospital.extensionYears !== originalHospital.extensionYears
                                          ? "text-blue-600 font-medium"
                                          : "text-gray-500"
                                      }
                                    >
                                      分組會議：{groupHospital.extensionYears} 年
                                      {groupHospital.extensionYears !== originalHospital.extensionYears && " (已修改)"}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <>
                                {hospital.extensionYears} 年
                                <span className="text-xs text-gray-500 ml-1">
                                  (至 {calculateExtensionDate(hospital.extensionYears, hospital.validUntil)})
                                </span>
                              </>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <div>
                                <Input
                                  type="number"
                                  value={editForm.quotaLimit}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, quotaLimit: Number.parseInt(e.target.value) })
                                  }
                                  className="bg-white w-20"
                                />
                                {showVersionDiff && originalHospital && groupHospital && (
                                  <div className="mt-1 text-xs space-y-0.5">
                                    <div className="text-gray-500">原始：{originalHospital.quotaLimit}</div>
                                    <div
                                      className={
                                        groupHospital.quotaLimit !== originalHospital.quotaLimit
                                          ? "text-blue-600 font-medium"
                                          : "text-gray-500"
                                      }
                                    >
                                      分組會議：{groupHospital.quotaLimit}
                                      {groupHospital.quotaLimit !== originalHospital.quotaLimit && " (已修改)"}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              hospital.quotaLimit
                            )}
                          </TableCell>
                          <TableCell>{hospital.previousYearQuota}</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <div>
                                <Input
                                  type="number"
                                  value={editForm.currentYearQuota}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, currentYearQuota: Number.parseInt(e.target.value) })
                                  }
                                  className="bg-white w-20"
                                />
                                {showVersionDiff && originalHospital && groupHospital && (
                                  <div className="mt-1 text-xs space-y-0.5">
                                    <div className="text-gray-500">原始：{originalHospital.currentYearQuota}</div>
                                    <div
                                      className={
                                        groupHospital.currentYearQuota !== originalHospital.currentYearQuota
                                          ? "text-blue-600 font-medium"
                                          : "text-gray-500"
                                      }
                                    >
                                      分組會議：{groupHospital.currentYearQuota}
                                      {groupHospital.currentYearQuota !== originalHospital.currentYearQuota &&
                                        " (已修改)"}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              hospital.currentYearQuota
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                hospital.teachingHospital === "合格"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {hospital.teachingHospital}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {isEditing ? (
                              <div className="flex gap-2 justify-center">
                                <Button variant="outline" size="sm" onClick={handleCancelReview}>
                                  取消
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={handleCompleteReview}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  完成
                                </Button>
                              </div>
                            ) : (
                              <Button variant="outline" size="sm" onClick={() => handleStartReview(hospital)}>
                                <Edit3 className="w-4 h-4 mr-2" />
                                編輯
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                        {isEditing && (
                          <TableRow>
                            <TableCell colSpan={10} className="bg-blue-50 border-t-0">
                              <div className="py-3 px-4">
                                <Label className="text-gray-700 font-medium mb-2 block">審核評論</Label>
                                <Textarea
                                  value={editForm.comment}
                                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                  placeholder="請輸入針對此醫院的審核評論..."
                                  rows={3}
                                  className="bg-white"
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-4">不合格醫院名單</h2>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">序號</TableHead>
                    <TableHead>醫院名稱</TableHead>
                    <TableHead>不合格原因</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unqualifiedHospitals.map((hospital, index) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="font-medium">{hospital.name}</TableCell>
                      <TableCell>{hospital.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="rrc" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="group">分組會議評論</TabsTrigger>
                  <TabsTrigger value="rrc">RRC 大會評論</TabsTrigger>
                </TabsList>

                <TabsContent value="group">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">分組會議整體案件評論</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{groupReviewFeedback || "尚無分組會議評論"}</p>
                  </div>
                  {/* CHANGE: 加入上傳按鈕 */}
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    上傳文件
                  </Button>
                </TabsContent>

                <TabsContent value="rrc">
                  <Label className="text-gray-700 font-medium mb-2 block">RRC 大會整體案件評論</Label>
                  <Textarea
                    value={rrcReviewFeedback}
                    onChange={(e) => setRrcReviewFeedback(e.target.value)}
                    placeholder="請輸入 RRC 大會針對整個申請案件的評論..."
                    rows={6}
                    className="w-full mb-3"
                  />
                  {/* CHANGE: 加入上傳按鈕 */}
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    上傳文件
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleCompleteAllReviews}>
                  儲存進度
                </Button>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
                  不通過結案
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">審查通過</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (society.stage === "upload-pending") {
    const groupReviewText = groupReviewFeedback || "無記錄"
    const rrcReviewText = rrcReviewFeedback || "無記錄"
    const groupReviewPreview = groupReviewText.length > 100 ? groupReviewText.substring(0, 100) + "..." : groupReviewText
    const rrcReviewPreview = rrcReviewText.length > 100 ? rrcReviewText.substring(0, 100) + "..." : rrcReviewText

    return (
      <div className="min-h-screen bg-gray-50">
        <ReviewSimpleNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">醫院容額分配審查 - {society.name}</h1>
              <Badge variant="outline" className="bg-purple-500 text-white">
                {society.year}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">待公告</Badge>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">RRC 審查已完成</h2>
              <p className="text-gray-600 mb-6">RRC 大會審查已完成，請上傳最終審查結果至系統</p>

              <div className="space-y-4 mb-6">
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">RRC 分組會議審查記錄</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setGroupReviewExpanded(!groupReviewExpanded)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {groupReviewExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            收合
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            展開閱讀更多
                          </>
                        )}
                      </Button>
                    </div>
                    <div className={`text-sm text-gray-700 leading-relaxed ${groupReviewExpanded ? 'max-h-96 overflow-y-auto' : ''}`}>
                      <div className="whitespace-pre-wrap" style={{ lineHeight: '1.7' }}>
                        {groupReviewExpanded ? groupReviewText : groupReviewPreview}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">RRC 大會審查記錄</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRrcReviewExpanded(!rrcReviewExpanded)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {rrcReviewExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            收合
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            展開閱讀更多
                          </>
                        )}
                      </Button>
                    </div>
                    <div className={`text-sm text-gray-700 leading-relaxed ${rrcReviewExpanded ? 'max-h-96 overflow-y-auto' : ''}`}>
                      <div className="whitespace-pre-wrap" style={{ lineHeight: '1.7' }}>
                        {rrcReviewExpanded ? rrcReviewText : rrcReviewPreview}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button onClick={() => setUploadDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Upload className="w-4 h-4 mr-2" />
                公告最終審查結果
              </Button>
            </CardContent>
          </Card>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>公告最終審查結果</DialogTitle>
              <DialogDescription>請上傳公文文件並填寫公告摘要</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              {/* 檔案上傳區域 */}
              <div>
                <Label className="mb-2 block font-medium">上傳公文檔案</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">拖放檔案至此區域或點擊選擇</p>
                    <p className="text-xs text-gray-500">支援格式：PDF, Word (.doc/.docx)</p>
                    <p className="text-xs text-gray-500">可上傳多個檔案</p>
                  </label>
                </div>
              </div>

              {/* 已選擇的檔案列表 */}
              {uploadedFiles.length > 0 && (
                <div>
                  <Label className="mb-2 block font-medium">已選擇的檔案</Label>
                  <div className="border border-gray-200 rounded-lg divide-y max-h-40 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 公告內容摘要 */}
              <div>
                <Label className="mb-2 block font-medium">公告內容摘要</Label>
                <Textarea
                  placeholder="請輸入公告的簡短說明（選填）"
                  value={announcementSummary}
                  onChange={(e) => setAnnouncementSummary(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* 最終審查結果選擇 */}
              <div>
                <Label className="mb-2 block font-medium">最終審查結果 *</Label>
                <Select value={finalResult} onValueChange={(v) => setFinalResult(v as typeof finalResult)}>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇審查結果" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">審核通過</SelectItem>
                    <SelectItem value="rejected">不通過</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                取消
              </Button>
              <Button
                onClick={handleUploadResult}
                className="bg-green-600 hover:bg-green-700"
                disabled={!finalResult}
              >
                確認公告
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // 如果沒有匹配到任何階段，顯示錯誤頁面
  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewSimpleNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">未知的審查階段</h1>
          <p className="text-gray-600 mb-4">目前審查階段: {society.stage}</p>
          <Button onClick={() => router.back()}>返回列表</Button>
        </div>
      </div>
    </div>
  )
}
