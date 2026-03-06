"use client"

import { useState, use } from "react"
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
import { ChevronLeft, Save } from "lucide-react"
import Link from "next/link"

const availableHospitals = [
  { code: "0401180014", name: "台大醫院" },
  { code: "0401190015", name: "榮民總醫院" },
  { code: "0401200016", name: "長庚醫院" },
  { code: "0401210017", name: "中國醫藥大學附醫" },
  { code: "0401220018", name: "成大醫院" },
  { code: "0401230019", name: "高雄長庚" },
  { code: "0401240020", name: "馬偕醫院" },
  { code: "0401250021", name: "新光醫院" },
  { code: "0401260022", name: "仁愛醫院" },
  { code: "0401270023", name: "和平醫院" },
]

const hospitalData: Record<
  string,
  {
    code: string
    name: string
    expiry: string
    extensionYears: string
    extensionDate: string
    prevQuota: number
    quotaLimit: number
    currentQuota: number
    applicationMode: "single" | "joint"
    partnerHospitals: string[]
  }
> = {
  "1": {
    code: "0401180014",
    name: "台大醫院",
    expiry: "有效至 2026/7/31",
    extensionYears: "4",
    extensionDate: "2030/7/31",
    prevQuota: 42,
    quotaLimit: 50,
    currentQuota: 45,
    applicationMode: "single",
    partnerHospitals: [],
  },
  "2": {
    code: "0401190015",
    name: "榮民總醫院",
    expiry: "有效至 2026/7/31",
    extensionYears: "0",
    extensionDate: "",
    prevQuota: 35,
    quotaLimit: 40,
    currentQuota: 38,
    applicationMode: "single",
    partnerHospitals: [],
  },
  "3": {
    code: "0401200016",
    name: "長庚醫院",
    expiry: "有效至 2024/7/31",
    extensionYears: "4",
    extensionDate: "2028/7/31",
    prevQuota: 30,
    quotaLimit: 40,
    currentQuota: 40,
    applicationMode: "single",
    partnerHospitals: [],
  },
  "5": {
    code: "0401260022",
    name: "仁愛醫院",
    expiry: "有效至 2026/7/31",
    extensionYears: "4",
    extensionDate: "2030/7/31",
    prevQuota: 50,
    quotaLimit: 60,
    currentQuota: 55,
    applicationMode: "joint",
    partnerHospitals: ["0401270023"],
  },
}

export default function QuotaEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const hospital = hospitalData[id] || hospitalData["1"]

  const [applicationMode, setApplicationMode] = useState<"single" | "joint">(
    hospital.applicationMode,
  )
  const [selectedMainHospital, setSelectedMainHospital] = useState(hospital.code)
  const [selectedPartnerHospitals, setSelectedPartnerHospitals] = useState<string[]>(
    hospital.partnerHospitals,
  )
  const [extensionYears, setExtensionYears] = useState(hospital.extensionYears)
  const [currentQuota, setCurrentQuota] = useState(hospital.currentQuota.toString())

  const calculateExtensionDate = (years: string) => {
    if (years === "0") return ""
    const baseYear = 2026
    const extendedYear = baseYear + parseInt(years)
    return `${extendedYear}/7/31`
  }

  const togglePartnerHospital = (hospitalCode: string) => {
    setSelectedPartnerHospitals((prev) =>
      prev.includes(hospitalCode) ? prev.filter((code) => code !== hospitalCode) : [...prev, hospitalCode],
    )
  }

  const getHospitalName = (code: string) => {
    return availableHospitals.find((h) => h.code === code)?.name || code
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="container mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link
            href="/filing?tab=quota"
            className="inline-flex items-center text-primary hover:underline"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回列表
          </Link>
          <span>|</span>
          <span>編輯容額分配</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-6">
          {hospital.name} - 容額分配編輯
        </h1>
      </div>

      <div className="container mx-auto px-6 pb-8">
        <div className="bg-card rounded-lg p-8 max-w-4xl">
          <div className="mb-8">
            <Label className="text-sm font-medium mb-3 block">
              申請方式 <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => {
                  setApplicationMode("single")
                  setSelectedPartnerHospitals([])
                }}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  applicationMode === "single"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-medium text-foreground">單一機構申請</div>
                <div className="text-xs text-muted-foreground mt-1">僅由一間醫院申請</div>
              </button>
              <button
                type="button"
                onClick={() => setApplicationMode("joint")}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  applicationMode === "joint"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-medium text-foreground">聯合申請</div>
                <div className="text-xs text-muted-foreground mt-1">主訓與合作醫院聯合</div>
              </button>
            </div>
          </div>

          <h2 className="text-lg font-bold text-foreground mb-6">基本資訊與容額設定</h2>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">
                主訓醫院 <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedMainHospital} onValueChange={setSelectedMainHospital}>
                <SelectTrigger>
                  <SelectValue placeholder="請選擇主訓醫院" />
                </SelectTrigger>
                <SelectContent>
                  {availableHospitals.map((h) => (
                    <SelectItem key={h.code} value={h.code}>
                      {h.code} - {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">效期</Label>
              <div className="bg-muted/50 px-4 py-3 rounded-lg text-foreground">
                {hospital.expiry}
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
                    <SelectItem value="0">不延長</SelectItem>
                    <SelectItem value="1">1 年</SelectItem>
                    <SelectItem value="2">2 年</SelectItem>
                    <SelectItem value="3">3 年</SelectItem>
                    <SelectItem value="4">4 年</SelectItem>
                  </SelectContent>
                </Select>
                {extensionYears !== "0" && (
                  <span className="text-muted-foreground">
                    (至 {calculateExtensionDate(extensionYears)})
                  </span>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">前年度核定容額</Label>
              <div className="bg-muted/50 px-4 py-3 rounded-lg text-foreground">
                {hospital.prevQuota} 名
              </div>
            </div>
          </div>

          {applicationMode === "joint" && (
            <div className="mt-8">
              <Label className="text-sm font-medium mb-3 block">
                合作醫院 <span className="text-destructive">*</span>
                <span className="text-muted-foreground font-normal ml-1">（可多選）</span>
              </Label>
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {availableHospitals
                  .filter((h) => h.code !== selectedMainHospital)
                  .map((h) => (
                    <div
                      key={h.code}
                      className="flex items-center gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`partner-edit-${h.code}`}
                        checked={selectedPartnerHospitals.includes(h.code)}
                        onCheckedChange={() => togglePartnerHospital(h.code)}
                      />
                      <Label
                        htmlFor={`partner-edit-${h.code}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {h.code} - {h.name}
                      </Label>
                    </div>
                  ))}
              </div>
              {selectedPartnerHospitals.length > 0 && (
                <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
                    已選擇 {selectedPartnerHospitals.length} 間合作醫院：
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartnerHospitals.map((code) => (
                      <span
                        key={code}
                        className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {getHospitalName(code)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <h2 className="text-lg font-bold text-foreground mt-10 mb-6">本年度容額設定</h2>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">容額上限</Label>
              <div className="bg-yellow-100 px-4 py-3 rounded-lg text-yellow-800 font-medium">
                {hospital.quotaLimit} 名
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                本年度容額不可超過此上限
              </p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">
                本年度擬核定容額
              </Label>
              <Input
                type="number"
                value={currentQuota}
                onChange={(e) => setCurrentQuota(e.target.value)}
                className="max-w-32"
                min={0}
                max={hospital.quotaLimit}
              />
              <p className="text-xs text-primary mt-2">
                請輸入 0 ~ {hospital.quotaLimit} 之間的數值
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t">
            <Link href="/filing?tab=quota">
              <Button variant="outline">取消</Button>
            </Link>
            <Button
              className="gap-2 bg-[#2d3a8c] hover:bg-[#252f73] text-white"
              disabled={applicationMode === "joint" && selectedPartnerHospitals.length === 0}
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

