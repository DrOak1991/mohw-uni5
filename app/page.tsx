import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Megaphone, ClipboardCheck, ArrowRight, Globe, BarChart3, Calculator } from "lucide-react"

export default function HomePage() {
  const modules = [
    {
      title: "帳號管理",
      description: "管理使用者帳號、權限設定與個人資料",
      icon: Users,
      color: "bg-blue-500",
      pages: [
        { name: "個人設定", href: "/account/personal", description: "管理個人資料、密碼與通知設定" },
        { name: "使用者管理列表", href: "/account/users", description: "檢視與管理系統使用者" },
        { name: "角色模板管理", href: "/account/role-templates", description: "管理權限角色模板" },
      ],
    },
    {
      title: "審查專區",
      description: "審查醫學會提交的填報文件與容額申請",
      icon: ClipboardCheck,
      color: "bg-green-500",
      pages: [
        { name: "填報審查", href: "/review/submissions", description: "審查醫學會提交的五份填報文件" },
        { name: "醫院容額分配審查", href: "/review/hospital-quota", description: "審查醫院容額分配申請" },
        { name: "外加容額審查", href: "/review/additional-quota", description: "審查外加容額申請" },
      ],
    },
    {
      title: "統計專區",
      description: "檢視系統統計數據與匯出報表",
      icon: BarChart3,
      color: "bg-indigo-500",
      pages: [
        { name: "統計儀表板", href: "/statistics", description: "檢視整體統計數據與視覺化圖表" },
        { name: "文件檢索", href: "/document-archive", description: "搜尋與管理系統中的所有文件" },
      ],
    },
    {
      title: "工具專區",
      description: "提供審查作業所需的輔助工具",
      icon: Calculator,
      color: "bg-teal-500",
      pages: [
        {
          name: "容額分配試算",
          href: "/tools/quota-calculator",
          description: "協助分組審查與 RRC 大會進行容額分配討論",
        },
      ],
    },
    {
      title: "公告管理",
      description: "管理系統公告的新增、編輯、發布與下架",
      icon: Megaphone,
      color: "bg-orange-500",
      pages: [{ name: "公告管理", href: "/announcement-management", description: "管理公告的新增、編輯、發布與下架" }],
    },
    {
      title: "公告欄",
      description: "檢視系統最新公告與重要消息",
      icon: Globe,
      color: "bg-purple-500",
      pages: [{ name: "公告列表", href: "/announcements", description: "瀏覽專科訓練認定、外加容額與甄審公告" }],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">醫事司五科系統</h1>
          <p className="text-gray-600">選擇功能模組開始使用</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <Card key={module.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.pages.map((page) => (
                      <Link key={page.href} href={page.href}>
                        <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {page.name}
                            </div>
                            <div className="text-sm text-gray-500">{page.description}</div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>提示：</strong>這是暫時性的導覽介面，正式版本將由其他團隊成員設計完整的導覽系統。
          </p>
        </div>
      </div>
    </div>
  )
}
