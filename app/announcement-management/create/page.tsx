'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Upload, X, FileText } from "lucide-react"

import { toast } from "sonner"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const categories = [
  { value: "training", label: "專科訓練認定" },
  { value: "additional", label: "外加容額" },
  { value: "review", label: "甄審" },
]

const announcementSchema = z.object({
  title: z.string().min(1, "請輸入公告標題"),
  category: z.string().min(1, "請選擇公告類別"),
  content: z.string().min(1, "請輸入公告內容"),
  isPinned: z.boolean().default(false),
  publishDate: z.string().optional(),
  expiryDate: z.string().optional(),
})

type AnnouncementFormValues = z.infer<typeof announcementSchema>

export default function CreateAnnouncementPage() {
  const router = useRouter()
  const [files, setFiles] = useState<{ name: string; size: number }[]>([])

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      category: "",
      content: "",
      isPinned: false,
      publishDate: "",
      expiryDate: "",
    },
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || [])
    setFiles((prev) => [
      ...prev,
      ...uploadedFiles.map((file) => ({
        name: file.name,
        size: file.size,
      })),
    ])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveDraft = (values: AnnouncementFormValues) => {
    console.log("[v0] Saving draft:", { ...values, files })
    toast.success("草稿已儲存", {
      description: "您可以稍後再回來編輯並發布此公告。",
    })
  }

  const handlePublish = (values: AnnouncementFormValues) => {
    console.log("[v0] Publishing:", { ...values, files })
    toast.success("公告已送出", {
      description: "公告已儲存並標記為已發布。",
    })
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

        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit((values) => handlePublish(values))}
          >
            {/* 基本資訊 */}
            <Card>
              <CardHeader>
                <CardTitle>基本資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>公告標題 *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="請輸入公告標題"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        建議使用清楚說明年份與主題的標題，例如「115 年度專科醫師訓練計畫甄審原則修訂公告」。
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>公告類別 *</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => {
                    const length = field.value?.length ?? 0
                    return (
                      <FormItem>
                        <FormLabel>公告內容 *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="請輸入公告內容，例如適用對象、適用期間、聯絡窗口與附件說明等。"
                            rows={10}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <p className="mt-1 text-sm text-gray-500">
                          已輸入 {length} 字元
                        </p>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                <FormField
                  control={form.control}
                  name="isPinned"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            id="pinned"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(Boolean(checked))
                            }
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="pinned"
                          className="cursor-pointer"
                        >
                          設為置頂公告
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 發布設定 */}
            <Card>
              <CardHeader>
                <CardTitle>發布設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="publishDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>發布日期</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <p className="mt-1 text-sm text-gray-500">
                          留空則儲存後立即於前台顯示。
                        </p>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>有效期限</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <p className="mt-1 text-sm text-gray-500">
                          留空則不自動下架，需由管理者手動下架。
                        </p>
                      </FormItem>
                    )}
                  />
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
              <Button type="button" variant="outline">
                取消
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={form.handleSubmit((values) => handleSaveDraft(values))}
            >
              儲存草稿
            </Button>
            <Button type="submit">
              發布公告
            </Button>
          </div>
        </form>
        </Form>
      </div>
    </div>
  )
}
