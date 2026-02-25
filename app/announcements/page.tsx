"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, FileText, Calendar, Pin } from "lucide-react"
import Link from "next/link"

const mockAnnouncements = [
  {
    id: "1",
    title: "115年度專科醫師訓練計畫認定基準修訂公告",
    category: "training",
    subcategory: "selection-criteria",
    publishDate: "2025-03-15",
    publisher: "醫事司",
    isNew: true,
    isPinned: true,
    hasAttachments: true,
    attachmentCount: 2,
    excerpt: "依據專科醫師分科及甄審辦法第五條規定，公告115年度各專科醫師訓練計畫認定基準修訂內容...",
  },
  {
    id: "2",
    title: "訓練醫院認定基準更新通知",
    category: "training",
    subcategory: "hospital-criteria",
    publishDate: "2025-03-10",
    publisher: "醫事司",
    isNew: true,
    isPinned: false,
    hasAttachments: true,
    attachmentCount: 1,
    excerpt: "為提升專科醫師訓練品質，更新訓練醫院認定基準相關規範...",
  },
  {
    id: "3",
    title: "114年度外加容額申請審查結果公告",
    category: "additional-quota",
    subcategory: "review-result",
    publishDate: "2025-03-05",
    publisher: "醫事司",
    isNew: false,
    isPinned: true,
    hasAttachments: true,
    attachmentCount: 3,
    excerpt: "公告114年度各醫院申請外加容額審查結果，核定名單詳如附件...",
  },
  {
    id: "4",
    title: "115年度外加容額申請開放公告",
    category: "additional-quota",
    subcategory: "application",
    publishDate: "2025-02-28",
    publisher: "醫事司",
    isNew: false,
    isPinned: false,
    hasAttachments: true,
    attachmentCount: 1,
    excerpt: "115年度外加容額申請即日起開放受理，申請期限至115年4月30日止...",
  },
  {
    id: "5",
    title: "115年度專科醫師甄審原則修訂說明",
    category: "review",
    subcategory: "principles",
    publishDate: "2025-02-20",
    publisher: "醫事司",
    isNew: false,
    isPinned: true,
    hasAttachments: true,
    attachmentCount: 2,
    excerpt: "配合醫療環境變遷，修訂115年度專科醫師甄審原則相關內容...",
  },
  {
    id: "6",
    title: "114年度醫院容額分配審查結果",
    category: "review",
    subcategory: "quota-result",
    publishDate: "2025-02-15",
    publisher: "醫事司",
    isNew: false,
    isPinned: false,
    hasAttachments: true,
    attachmentCount: 4,
    excerpt: "公告114年度各醫學會醫院容額分配審查結果，核定名單及容額數詳如附件...",
  },
  {
    id: "7",
    title: "訓練課程基準修正案說明會通知",
    category: "training",
    subcategory: "course-criteria",
    publishDate: "2025-02-10",
    publisher: "醫事司",
    isNew: false,
    isPinned: false,
    hasAttachments: true,
    attachmentCount: 1,
    excerpt: "將於115年3月20日舉辦訓練課程基準修正案說明會，歡迎各醫學會代表參加...",
  },
  {
    id: "8",
    title: "公告評核標準更新通知",
    category: "training",
    subcategory: "evaluation-criteria",
    publishDate: "2025-02-05",
    publisher: "醫事司",
    isNew: false,
    isPinned: false,
    hasAttachments: true,
    attachmentCount: 2,
    excerpt: "更新專科醫師訓練公告評核標準，新增評核項目與配分調整說明...",
  },
]

const categoryConfig = {
  all: { label: "全部公告", color: "default" },
  training: { label: "專科訓練認定", color: "blue" },
  "additional-quota": { label: "外加容額", color: "green" },
  review: { label: "甄審", color: "purple" },
}

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAnnouncements = mockAnnouncements
    .filter((announcement) => {
      const matchesCategory = activeTab === "all" || announcement.category === activeTab
      const matchesSearch =
        searchQuery === "" ||
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    })

  return (
    <div className="container mx-auto py-6 px-3 sm:py-8 sm:px-4 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">公告欄</h1>
        <p className="text-sm sm:text-base text-muted-foreground">瀏覽專科訓練認定、外加容額及甄審等相關公告與函釋</p>
      </div>

      {/* 搜尋列 */}
      <div className="mb-4 sm:mb-6 flex gap-2">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜尋公告標題或內容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* 分類 Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 gap-1 h-auto sm:grid-cols-4 lg:w-auto lg:inline-grid lg:h-10">
          <TabsTrigger value="all" className="text-sm sm:text-base">
            全部公告
          </TabsTrigger>
          <TabsTrigger value="training" className="text-sm sm:text-base">
            專科訓練認定
          </TabsTrigger>
          <TabsTrigger value="additional-quota" className="text-sm sm:text-base">
            外加容額
          </TabsTrigger>
          <TabsTrigger value="review" className="text-sm sm:text-base">
            甄審
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-3 sm:space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">目前沒有相關公告</p>
              </CardContent>
            </Card>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Link key={announcement.id} href={`/announcements/${announcement.id}`}>
                <Card
                  className={`hover:bg-accent/50 transition-colors cursor-pointer ${
                    announcement.isPinned ? "border-l-4 border-l-amber-500 bg-amber-50/30" : ""
                  }`}
                >
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-2 flex-wrap">
                          {announcement.isPinned && (
                            <Pin className="h-4 w-4 text-amber-600 fill-amber-600 flex-shrink-0 mt-0.5" />
                          )}
                          <CardTitle className="text-base sm:text-xl flex-1">{announcement.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {announcement.isNew && (
                            <Badge variant="destructive" className="text-xs">
                              NEW
                            </Badge>
                          )}
                          {announcement.isPinned && (
                            <Badge className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200">置頂</Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {categoryConfig[announcement.category as keyof typeof categoryConfig].label}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {announcement.publishDate}
                          </span>
                          <span className="hidden sm:inline">發布單位：{announcement.publisher}</span>
                          {announcement.hasAttachments && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <FileText className="h-3 w-3" />
                              附件 ({announcement.attachmentCount})
                            </span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{announcement.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
