"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, FileText, Calendar, Pin } from "lucide-react"
import Link from "next/link"
import { getAnnouncements } from "@/lib/mock/announcements"

const categoryConfig = {
  all: { label: "全部公告", color: "default" },
  training: { label: "專科訓練認定", color: "blue" },
  "additional-quota": { label: "外加容額", color: "green" },
  review: { label: "甄審", color: "purple" },
}

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const announcements = getAnnouncements()

  const filteredAnnouncements = announcements
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
