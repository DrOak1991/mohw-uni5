"use client"

import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Building2, FileText, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

const mockAnnouncementDetails: Record<string, any> = {
  "1": {
    id: "1",
    title: "115年度專科醫師訓練計畫認定基準修訂公告",
    category: "training",
    subcategory: "甄審原則",
    publishDate: "2025-03-15",
    publisher: "醫事司",
    publisherUnit: "醫事司第五科",
    effectiveDate: "2025-04-01",
    content: `
一、公告依據：
依據專科醫師分科及甄審辦法第五條規定，公告115年度各專科醫師訓練計畫認定基準修訂內容。

二、修訂重點：
（一）調整訓練期程規定，明確規範各專科訓練年限及階段要求
（二）新增臨床技能評核機制，強化實務訓練品質管控
（三）增訂跨領域整合訓練課程要求，培養全人照護能力
（四）修正師資資格條件，提升教學品質
（五）調整訓練容額計算方式，確保訓練品質

三、適用對象：
本修訂基準適用於115年度申請專科醫師訓練計畫認定之各專科醫學會。

四、施行日期：
本修訂基準自115年4月1日起施行。

五、相關規定：
各專科醫學會應於收到本公告後30日內，依修訂基準調整訓練計畫內容，並提送本部審查。

六、聯絡窗口：
如有疑問，請洽醫事司第五科，電話：(02)8590-6666分機7100。
    `.trim(),
    attachments: [
      {
        id: "1-1",
        name: "115年度專科醫師訓練計畫認定基準修訂對照表.pdf",
        size: "2.3 MB",
        uploadDate: "2025-03-15",
      },
      {
        id: "1-2",
        name: "專科醫師訓練計畫認定基準修訂說明.docx",
        size: "856 KB",
        uploadDate: "2025-03-15",
      },
    ],
    relatedAnnouncements: [
      { id: "2", title: "訓練醫院認定基準更新通知", date: "2025-03-10" },
      { id: "7", title: "訓練課程基準修正案說明會通知", date: "2025-02-10" },
    ],
  },
  "2": {
    id: "2",
    title: "訓練醫院認定基準更新通知",
    category: "training",
    subcategory: "訓練醫院認定基準",
    publishDate: "2025-03-10",
    publisher: "醫事司",
    publisherUnit: "醫事司第五科",
    effectiveDate: "2025-03-20",
    content: `
一、公告目的：
為提升專科醫師訓練品質，更新訓練醫院認定基準相關規範，以確保訓練環境符合教學需求。

二、更新內容：
（一）提高訓練醫院基本設備要求標準
（二）明訂師資人力配置最低標準
（三）新增年度評鑑機制及退場機制
（四）調整各專科別訓練醫院容額計算方式

三、適用範圍：
本更新基準適用於所有申請成為專科醫師訓練醫院之醫療機構。

四、施行日期：
本更新基準自115年3月20日起施行。

五、辦理方式：
現有訓練醫院應於本公告發布後60日內完成自我評估，並提送改善計畫。

六、聯絡資訊：
承辦人：李小姐，電話：(02)8590-6666分機7105。
    `.trim(),
    attachments: [
      {
        id: "2-1",
        name: "訓練醫院認定基準更新內容.pdf",
        size: "1.8 MB",
        uploadDate: "2025-03-10",
      },
    ],
    relatedAnnouncements: [{ id: "1", title: "115年度專科醫師訓練計畫認定基準修訂公告", date: "2025-03-15" }],
  },
  "3": {
    id: "3",
    title: "114年度外加容額申請審查結果公告",
    category: "additional-quota",
    subcategory: "審查結果",
    publishDate: "2025-03-05",
    publisher: "醫事司",
    publisherUnit: "醫事司第五科",
    content: `
一、審查說明：
本部已完成114年度各醫院申請外加容額之審查作業，核定結果如附件名單。

二、核定原則：
（一）符合偏遠地區醫療需求者
（二）配合國家重點醫療政策者
（三）訓練品質經評估合格者

三、核定內容：
本次共核定23家醫院，總計外加容額156名，分布於內科、外科、婦產科等15個專科。

四、注意事項：
（一）核定醫院應於收到通知後30日內確認是否接受
（二）外加容額有效期限為3年
（三）訓練品質需持續符合本部規定

五、後續作業：
獲核定醫院將另行收到正式核定函，請依函文辦理後續作業。
    `.trim(),
    attachments: [
      {
        id: "3-1",
        name: "114年度外加容額核定名單.pdf",
        size: "1.2 MB",
        uploadDate: "2025-03-05",
      },
      {
        id: "3-2",
        name: "外加容額分配統計表.xlsx",
        size: "245 KB",
        uploadDate: "2025-03-05",
      },
      {
        id: "3-3",
        name: "審查會議紀錄.pdf",
        size: "3.1 MB",
        uploadDate: "2025-03-05",
      },
    ],
    relatedAnnouncements: [{ id: "4", title: "115年度外加容額申請開放公告", date: "2025-02-28" }],
  },
}

export default function AnnouncementDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const announcement = mockAnnouncementDetails[params.id]

  if (!announcement) {
    notFound()
  }

  const categoryConfig: Record<string, { label: string; color: string }> = {
    training: { label: "專科訓練認定", color: "blue" },
    "additional-quota": { label: "外加容額", color: "green" },
    review: { label: "甄審", color: "purple" },
  }

  return (
    <div className="container mx-auto py-6 px-3 sm:py-8 sm:px-4 max-w-5xl">
      {/* 返回按鈕 */}
      <div className="mb-4 sm:mb-6">
        <Link href="/announcements">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">返回公告列表</span>
            <span className="sm:hidden">返回</span>
          </Button>
        </Link>
      </div>

      {/* 公告標題區 */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <Badge variant="outline" className="w-fit text-xs sm:text-sm">
              {categoryConfig[announcement.category].label}
            </Badge>
            <CardTitle className="text-xl sm:text-3xl leading-tight">{announcement.title}</CardTitle>
            <CardDescription className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm sm:text-base">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                發布日期：{announcement.publishDate}
              </span>
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                發布單位：{announcement.publisherUnit}
              </span>
              {announcement.effectiveDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  生效日期：{announcement.effectiveDate}
                </span>
              )}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* 公告內容 */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">公告內容</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="prose prose-sm max-w-none text-sm sm:text-base">
            <div className="whitespace-pre-wrap leading-relaxed">{announcement.content}</div>
          </div>
        </CardContent>
      </Card>

      {/* 附件下載 */}
      {announcement.attachments && announcement.attachments.length > 0 && (
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              相關附件 ({announcement.attachments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2 sm:space-y-3">
              {announcement.attachments.map((attachment: any) => (
                <div
                  key={attachment.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-sm sm:text-base">{attachment.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {attachment.size} · 上傳日期：{attachment.uploadDate}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 w-full sm:w-auto sm:flex-shrink-0 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    下載
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 相關公告 */}
      {announcement.relatedAnnouncements && announcement.relatedAnnouncements.length > 0 && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">相關公告</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2">
              {announcement.relatedAnnouncements.map((related: any) => (
                <Link key={related.id} href={`/announcements/${related.id}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start sm:items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="font-medium text-sm sm:text-base">{related.title}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground sm:flex-shrink-0 ml-7 sm:ml-0">
                      {related.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
