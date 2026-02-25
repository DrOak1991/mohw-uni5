import { SimpleNav } from "@/components/account/simple-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Copy, Shield, Users } from "lucide-react"
import Link from "next/link"

// 模擬角色模板資料
const roleTemplates = [
  {
    id: "1",
    name: "一般使用者",
    description: "基本的檢視權限，適用於一般瀏覽者",
    userCount: 45,
    isSystem: true,
    createdDate: "2025/01/01",
    lastModified: "2025/01/01",
  },
  {
    id: "2",
    name: "專科醫學會編輯",
    description: "可填報與編輯各類規範文件，適用於專科醫學會人員",
    userCount: 28,
    isSystem: true,
    createdDate: "2025/01/01",
    lastModified: "2025/09/15",
  },
  {
    id: "3",
    name: "醫策會審查委員",
    description: "可審查各類填報與變更案件，適用於醫策會審查委員",
    userCount: 12,
    isSystem: true,
    createdDate: "2025/01/01",
    lastModified: "2025/08/20",
  },
  {
    id: "4",
    name: "醫事司承辦",
    description: "擁有公告管理與後台操作權限，適用於醫事司承辦人員",
    userCount: 8,
    isSystem: true,
    createdDate: "2025/01/01",
    lastModified: "2025/10/01",
  },
  {
    id: "5",
    name: "系統管理員",
    description: "擁有所有功能的完整權限，適用於系統管理人員",
    userCount: 3,
    isSystem: true,
    createdDate: "2025/01/01",
    lastModified: "2025/01/01",
  },
  {
    id: "6",
    name: "外部審查委員",
    description: "僅可審查特定類型的案件，適用於外部專家",
    userCount: 15,
    isSystem: false,
    createdDate: "2025/03/10",
    lastModified: "2025/09/28",
  },
]

export default function RoleTemplatesPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <SimpleNav />

      <div className="container mx-auto px-4 py-8">
        {/* 頁面標題 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">角色模板管理</h1>
            <p className="text-sm text-muted-foreground mt-1">建立與管理角色權限模板，快速套用至使用者帳號</p>
          </div>
          <Link href="/account/role-templates/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新增角色模板
            </Button>
          </Link>
        </div>

        {/* 角色模板列表 */}
        <Card>
          <CardHeader>
            <CardTitle>角色模板列表</CardTitle>
            <CardDescription>管理系統中的所有角色權限模板</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>角色名稱</TableHead>
                    <TableHead>說明</TableHead>
                    <TableHead>類型</TableHead>
                    <TableHead>使用人數</TableHead>
                    <TableHead>最後修改</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roleTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="font-medium">{template.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                      </TableCell>
                      <TableCell>
                        {template.isSystem ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            系統預設
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            自訂模板
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{template.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{template.lastModified}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/account/role-templates/${template.id}`}>
                            <Button size="sm" variant="ghost" title="編輯模板">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="ghost" title="複製模板">
                            <Copy className="h-4 w-4" />
                          </Button>
                          {!template.isSystem && (
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" title="刪除">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 提示資訊 */}
        <Card className="mt-6 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-yellow-900">角色模板管理提醒</p>
              <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                <li>系統預設模板無法刪除，但可以修改權限設定</li>
                <li>修改模板權限不會影響已套用該模板的使用者</li>
                <li>刪除自訂模板前，請確認沒有使用者正在使用</li>
                <li>可以複製現有模板來建立新的角色模板</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
