"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, X, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const availableHospitals = [
  { code: "0401180014", name: "台大醫院" },
  { code: "0401180015", name: "台北榮民總醫院" },
  { code: "0401180016", name: "三軍總醫院" },
  { code: "0401180017", name: "馬偕紀念醫院" },
  { code: "0401180018", name: "新光醫院" },
  { code: "0401180019", name: "國泰醫院" },
  { code: "0401180020", name: "亞東醫院" },
  { code: "0401180021", name: "慈濟醫院" },
  { code: "0401180022", name: "奇美醫院" },
  { code: "0401180023", name: "成大醫院" },
  { code: "0401180024", name: "高雄長庚醫院" },
  { code: "0401180025", name: "高雄榮民總醫院" },
]

export default function NewQuotaPage() {
  const router = useRouter()
  const [applicationMode, setApplicationMode] = useState<"single" | "joint">("single")
  const [selectedMainHospital, setSelectedMainHospital] = useState("")
  const [selectedPartnerHospitals, setSelectedPartnerHospitals] = useState<string[]>([])
  const [extensionYears, setExtensionYears] = useState("0")
  const [currentQuota, setCurrentQuota] = useState("")

  const togglePartnerHospital = (hospitalCode: string) => {
    setSelectedPartnerHospitals((prev) =>
      prev.includes(hospitalCode) ? prev.filter((code) => code !== hospitalCode) : [...prev, hospitalCode],
    )
  }

  const removePartnerHospital = (hospitalCode: string) => {
    setSelectedPartnerHospitals((prev) => prev.filter((code) => code !== hospitalCode))
  }

  const getHospitalName = (code: string) => {
    return availableHospitals.find((h) => h.code === code)?.name || code
  }

  const handleSave = () => {
    console.log("申請方式:", applicationMode === "single" ? "單一機構申請" : "聯合申請")
    console.log("主訓醫院:", selectedMainHospital)
    if (applicationMode === "joint") {
      console.log("合作醫院:", selectedPartnerHospitals)
    }
    console.log("延長效期:", extensionYears)
    console.log("本年度擬核定容額:", currentQuota)
    router.push("/filing?tab=quota")
  }

  const canSave =
    selectedMainHospital &&
    (applicationMode === "single" || selectedPartnerHospitals.length > 0) &&
    currentQuota

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-6 py-3">
          <p className="text-sm text-muted-foreground">首頁 / 填報專區 / 新增醫院容額</p>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-6">
        <Link
          href="/filing"
          className="inline-flex items-center text-primary hover:underline text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回填報專區
        </Link>
      </div>

      <div className="container mx-auto px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">新增醫院容額</h1>
      </div>

      <div className="container mx-auto px-6 pb-8">
        <div className="max-w-4xl space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4">申請方式</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setApplicationMode("single")
                  setSelectedPartnerHospitals([])
                }}
                className={`p-5 rounded-lg border-2 text-left transition-colors ${
                  applicationMode === "single"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-medium text-foreground text-lg">單一機構申請</div>
                <div className="text-sm text-muted-foreground mt-1">僅由一間醫院獨立申請容額</div>
              </button>
              <button
                type="button"
                onClick={() => setApplicationMode("joint")}
                className={`p-5 rounded-lg border-2 text-left transition-colors ${
                  applicationMode === "joint"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-medium text-foreground text-lg">聯合申請</div>
                <div className="text-sm text-muted-foreground mt-1">
                  主訓醫院與合作醫院聯合申請
                </div>
              </button>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4">
              主訓醫院 <span className="text-destructive">*</span>
            </h2>
            <Select value={selectedMainHospital} onValueChange={setSelectedMainHospital}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="請選擇主訓醫院" />
              </SelectTrigger>
              <SelectContent>
                {availableHospitals.map((hospital) => (
                  <SelectItem key={hospital.code} value={hospital.code}>
                    {hospital.code} - {hospital.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {applicationMode === "joint" && (
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="font-semibold text-foreground mb-4">
                合作醫院 <span className="text-destructive">*</span>
                <span className="text-sm font-normal text-muted-foreground ml-2">（可多選）</span>
              </h2>

              {selectedPartnerHospitals.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPartnerHospitals.map((code) => (
                    <div
                      key={code}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                    >
                      {getHospitalName(code)}
                      <button
                        onClick={() => removePartnerHospital(code)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {availableHospitals
                  .filter((h) => h.code !== selectedMainHospital)
                  .map((hospital) => (
                    <div
                      key={hospital.code}
                      className="flex items-center gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`partner-${hospital.code}`}
                        checked={selectedPartnerHospitals.includes(hospital.code)}
                        onCheckedChange={() => togglePartnerHospital(hospital.code)}
                      />
                      <Label
                        htmlFor={`partner-${hospital.code}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {hospital.code} - {hospital.name}
                      </Label>
                    </div>
                  ))}
              </div>

              {selectedPartnerHospitals.length > 0 && (
                <p className="text-xs text-muted-foreground mt-3">
                  已選擇 {selectedPartnerHospitals.length} 間合作醫院
                </p>
              )}
            </div>
          )}

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="font-semibold text-foreground mb-4">基本資訊與容額設定</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">效期</Label>
                <div className="bg-muted/50 px-4 py-3 rounded-lg text-foreground">
                  有效至 2026/7/31
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">延長效期</Label>
                <div className="flex items-center gap-3">
                  <Select value={extensionYears} onValueChange={setExtensionYears}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 年</SelectItem>
                      <SelectItem value="1">1 年</SelectItem>
                      <SelectItem value="2">2 年</SelectItem>
                      <SelectItem value="3">3 年</SelectItem>
                      <SelectItem value="4">4 年</SelectItem>
                    </SelectContent>
                  </Select>
                  {extensionYears !== "0" && (
                    <span className="text-sm text-muted-foreground">
                      (至 {2026 + parseInt(extensionYears)}/7/31)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">容額上限</Label>
                <div className="bg-[#fef9c3] px-4 py-3 rounded-lg text-foreground font-medium">
                  50 名
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  本年度容額不可超過此上限
                </p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  本年度擬核定容額 <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  value={currentQuota}
                  onChange={(e) => setCurrentQuota(e.target.value)}
                  placeholder="請輸入容額"
                  min={0}
                  max={50}
                />
                <p className="text-xs text-primary mt-1">請輸入 0 ~ 50 之間的數值</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link href="/filing">
              <Button variant="outline">取消</Button>
            </Link>
            <Button
              className="gap-2 bg-[#2d3a8c] hover:bg-[#252f73] text-white"
              onClick={handleSave}
              disabled={!canSave}
            >
              <Save className="h-4 w-4" />
              儲存變更
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

