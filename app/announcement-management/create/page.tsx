'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, X, FileText } from 'lucide-react'

const categories = [
  { value: "training", label: "專科訓練認定" },
  { value: "additional", label: "外加容額" },
  { value: "review", label: "甄審" },
]

export default function CreateAnnouncementPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [content, setContent] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  const [publishDate, setPublishDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [files, setFiles] = useState<{ name: string; size: number }[]>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || [])
    setFiles([
      ...files,
      ...uploadedFiles.map((file) => ({
        name: file.name,
        size: file.size,
      })),
    ])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSaveDraft = () => {
    // 儲存草稿邏輯
    console.log("[v0] Saving draft:", { title, category, content, isPinned, files })
    alert("草稿已儲存")
  }

  const handlePublish = () => {
    // 發布邏輯
    console.log("[v0] Publishing:", { title, category, content, isPinned, publishDate, expiryDate, files })
    alert("公告已發布")
    router.push("/announcement-management")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/announcement-management">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回公告管理
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">新增公告</h1>
          <p className="text-sm text-gray-600">填寫公告資訊並上傳相關附件</p>
        </div>

        <div className="space-y-6">
          {/* 基本資訊 */}
          <Card>
            <CardHeader>
              <CardTitle>基本資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">公告標題 *</Label>
                <Input
                  id="title"
                  placeholder="請輸入公告標題"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category">公告類別 *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="選擇公告類別" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content">公告內容 *</Label>
                <Textarea
                  id="content"
                  placeholder="請輸入公告內容"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  已輸入 {content.length} 字元
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pinned"
                  checked={isPinned}
                  onCheckedChange={(checked) => setIsPinned(checked as boolean)}
                />
                <Label htmlFor="pinned" className="cursor-pointer">
                  設為置頂公告
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* 發布設定 */}
          <Card>
            <CardHeader>
              <CardTitle>發布設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="publishDate">發布日期</Label>
                  <Input
                    id="publishDate"
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">留空則立即發布</p>
                </div>
                <div>
                  <Label htmlFor="expiryDate">有效期限</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">留空則永久有效</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 附件上傳 */}
          <Card>
            <CardHeader>
              <CardTitle>附件上傳</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    點擊上傳或拖曳檔案至此區域
                  </p>
                  <p className="text-xs text-gray-500">支援格式：PDF、Word、Excel 等</p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 操作按鈕 */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/announcement-management">
              <Button variant="outline">取消</Button>
            </Link>
            <Button variant="outline" onClick={handleSaveDraft}>
              儲存草稿
            </Button>
            <Button onClick={handlePublish}>發布公告</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
