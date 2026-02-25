import { SimpleNav } from "@/components/account/simple-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Key, User } from "lucide-react"

export default function PersonalSettingsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <SimpleNav />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 頁面標題 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">個人設定</h1>
          <p className="text-sm text-muted-foreground mt-1">管理您的個人資料與密碼</p>
        </div>

        <div className="space-y-6">
          {/* 個人資料卡片 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>個人資料</CardTitle>
              </div>
              <CardDescription>您的基本帳號資訊</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">姓名</p>
                  <p className="text-base font-medium">王小明</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">帳號</p>
                  <p className="text-base font-medium">wang.xiaoming@example.com</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">所屬單位</p>
                  <p className="text-base font-medium">醫事司五科</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">目前角色</p>
                  <div>
                    <Badge variant="secondary" className="text-sm">
                      一般使用者
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 密碼重置 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>密碼重置</CardTitle>
              </div>
              <CardDescription>變更您的登入密碼</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">
                  目前密碼 <span className="text-destructive">*</span>
                </Label>
                <Input id="current-password" type="password" placeholder="請輸入目前密碼" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">
                  新密碼 <span className="text-destructive">*</span>
                </Label>
                <Input id="new-password" type="password" placeholder="請輸入新密碼" />
                <p className="text-xs text-muted-foreground">密碼需至少 8 個字元，包含大小寫字母與數字</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  確認新密碼 <span className="text-destructive">*</span>
                </Label>
                <Input id="confirm-password" type="password" placeholder="再次輸入新密碼" />
              </div>

              <Button className="w-full">更新密碼</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
