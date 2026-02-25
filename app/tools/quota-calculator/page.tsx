"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Download, RotateCcw, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const specialties = [
  { id: "internal", name: "內科" },
  { id: "surgery", name: "外科" },
  { id: "pediatrics", name: "小兒科" },
  { id: "obgyn", name: "婦產科" },
  { id: "orthopedics", name: "骨科" },
  { id: "neurology", name: "神經科" },
  { id: "psychiatry", name: "精神科" },
  { id: "dermatology", name: "皮膚科" },
  { id: "urology", name: "泌尿科" },
  { id: "ophthalmology", name: "眼科" },
  { id: "ent", name: "耳鼻喉科" },
  { id: "radiology", name: "放射科" },
  { id: "anesthesiology", name: "麻醉科" },
  { id: "pathology", name: "病理科" },
  { id: "rehabilitation", name: "復健科" },
  { id: "emergency", name: "急診醫學科" },
  { id: "family", name: "家庭醫學科" },
  { id: "occupational", name: "職業醫學科" },
  { id: "plastic", name: "整形外科" },
  { id: "neurosurgery", name: "神經外科" },
  { id: "thoracic", name: "胸腔外科" },
  { id: "cardiovascular", name: "心臟血管外科" },
  { id: "nuclear", name: "核子醫學科" },
]

const generateHospitalDataForSpecialty = (specialtyId: string) => {
  // 根據專科產生不同的容額數據（模擬）
  const baseMultiplier = specialties.findIndex((s) => s.id === specialtyId) + 1
  const randomFactor = (baseMultiplier % 5) + 1

  return {
    north: {
      name: "北區",
      color: "#ef4444",
      hospitals: [
        { id: "n1", name: "台大醫院", quota: Math.round(45 * randomFactor * 0.3) },
        { id: "n2", name: "台北榮民總醫院", quota: Math.round(38 * randomFactor * 0.3) },
        { id: "n3", name: "三軍總醫院", quota: Math.round(28 * randomFactor * 0.3) },
        { id: "n4", name: "林口長庚醫院", quota: Math.round(35 * randomFactor * 0.3) },
        { id: "n5", name: "馬偕紀念醫院", quota: Math.round(18 * randomFactor * 0.3) },
        { id: "n6", name: "新光醫院", quota: Math.round(10 * randomFactor * 0.3) },
      ],
    },
    central: {
      name: "中區",
      color: "#f97316",
      hospitals: [
        { id: "c1", name: "台中榮民總醫院", quota: Math.round(42 * randomFactor * 0.25) },
        { id: "c2", name: "中國醫藥大學附設醫院", quota: Math.round(38 * randomFactor * 0.25) },
        { id: "c3", name: "彰化基督教醫院", quota: Math.round(32 * randomFactor * 0.25) },
        { id: "c4", name: "中山醫學大學附設醫院", quota: Math.round(25 * randomFactor * 0.25) },
        { id: "c5", name: "童綜合醫院", quota: Math.round(13 * randomFactor * 0.25) },
      ],
    },
    south: {
      name: "南區",
      color: "#eab308",
      hospitals: [
        { id: "s1", name: "成大醫院", quota: Math.round(40 * randomFactor * 0.25) },
        { id: "s2", name: "高雄榮民總醫院", quota: Math.round(35 * randomFactor * 0.25) },
        { id: "s3", name: "高雄長庚醫院", quota: Math.round(32 * randomFactor * 0.25) },
        { id: "s4", name: "高雄醫學大學附設醫院", quota: Math.round(22 * randomFactor * 0.25) },
        { id: "s5", name: "奇美醫院", quota: Math.round(10 * randomFactor * 0.25) },
      ],
    },
    east: {
      name: "東區",
      color: "#22c55e",
      hospitals: [
        { id: "e1", name: "花蓮慈濟醫院", quota: Math.round(20 * randomFactor * 0.2) },
        { id: "e2", name: "門諾醫院", quota: Math.round(10 * randomFactor * 0.2) },
        { id: "e3", name: "台東馬偕醫院", quota: Math.round(5 * randomFactor * 0.2) },
      ],
    },
  }
}

type HospitalData = ReturnType<typeof generateHospitalDataForSpecialty>
type RegionKey = keyof HospitalData

export default function QuotaCalculatorPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0].id)
  const [hospitalData, setHospitalData] = useState<HospitalData>(() =>
    generateHospitalDataForSpecialty(specialties[0].id),
  )
  const [expandedRegions, setExpandedRegions] = useState<Record<RegionKey, boolean>>({
    north: true,
    central: true,
    south: true,
    east: true,
  })
  const mapRef = useRef<HTMLDivElement>(null)

  const handleSpecialtyChange = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId)
    setHospitalData(generateHospitalDataForSpecialty(specialtyId))
  }

  // 取得目前選擇的專科名稱
  const currentSpecialtyName = specialties.find((s) => s.id === selectedSpecialty)?.name || ""

  // 計算各區總和
  const regionTotals = Object.entries(hospitalData).reduce(
    (acc, [key, region]) => {
      acc[key as RegionKey] = region.hospitals.reduce((sum, h) => sum + h.quota, 0)
      return acc
    },
    {} as Record<RegionKey, number>,
  )

  // 計算總數
  const grandTotal = Object.values(regionTotals).reduce((sum, val) => sum + val, 0)

  // 計算各區百分比
  const regionPercentages = Object.entries(regionTotals).reduce(
    (acc, [key, total]) => {
      acc[key as RegionKey] = grandTotal > 0 ? (total / grandTotal) * 100 : 0
      return acc
    },
    {} as Record<RegionKey, number>,
  )

  // 計算泡泡大小（最小 40px，最大 120px）
  const getBubbleSize = (region: RegionKey) => {
    const percentage = regionPercentages[region]
    const minSize = 50
    const maxSize = 130
    return minSize + (percentage / 100) * (maxSize - minSize)
  }

  // 更新醫院容額
  const updateHospitalQuota = (region: RegionKey, hospitalId: string, value: string) => {
    const numValue = Number.parseInt(value) || 0
    setHospitalData((prev) => ({
      ...prev,
      [region]: {
        ...prev[region],
        hospitals: prev[region].hospitals.map((h) => (h.id === hospitalId ? { ...h, quota: numValue } : h)),
      },
    }))
  }

  // 切換區域展開/收合
  const toggleRegion = (region: RegionKey) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [region]: !prev[region],
    }))
  }

  // 重置資料
  const handleReset = () => {
    setHospitalData(generateHospitalDataForSpecialty(selectedSpecialty))
    toast.success("已重置為初始資料")
  }

  // 儲存試算結果
  const handleSave = () => {
    toast.success("試算結果已儲存")
  }

  // 匯出功能
  const handleExport = () => {
    toast.success("已匯出試算結果")
  }

  // 泡泡位置設定（對應台灣地圖的北中南東位置）
  const bubblePositions = {
    north: { top: "18%", left: "58%" },
    central: { top: "42%", left: "35%" },
    south: { top: "72%", left: "42%" },
    east: { top: "50%", left: "68%" },
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">容額分配試算工具</h1>
              <p className="text-sm text-gray-500">協助分組審查與 RRC 大會階段進行容額分配討論</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              重置
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              匯出
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              儲存
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <span className="text-sm font-medium text-gray-700">選擇專科：</span>
          <Select value={selectedSpecialty} onValueChange={handleSpecialtyChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="選擇專科" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">
            目前檢視：<span className="font-semibold text-gray-900">{currentSpecialtyName}</span> 容額分配
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* 左側：輸入表格 - 可滾動 */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{currentSpecialtyName} - 各區醫院訓練容額</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(Object.entries(hospitalData) as [RegionKey, typeof hospitalData.north][]).map(
                  ([regionKey, region]) => (
                    <div key={regionKey} className="border rounded-lg overflow-hidden">
                      {/* 區域標題 */}
                      <button
                        onClick={() => toggleRegion(regionKey)}
                        className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: region.color }} />
                          <span className="font-medium text-sm">{region.name}</span>
                          <span className="text-xs text-gray-500">({region.hospitals.length} 家)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold" style={{ color: region.color }}>
                            {regionTotals[regionKey]} 人 ({regionPercentages[regionKey].toFixed(1)}%)
                          </span>
                          {expandedRegions[regionKey] ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                      </button>

                      {/* 醫院列表 */}
                      {expandedRegions[regionKey] && (
                        <div className="divide-y">
                          {region.hospitals.map((hospital) => (
                            <div
                              key={hospital.id}
                              className="flex items-center justify-between px-3 py-1.5 hover:bg-gray-50"
                            >
                              <span className="text-sm text-gray-700">{hospital.name}</span>
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  min="0"
                                  value={hospital.quota}
                                  onChange={(e) => updateHospitalQuota(regionKey, hospital.id, e.target.value)}
                                  className="w-16 h-7 text-right text-sm"
                                />
                                <span className="text-xs text-gray-500 w-4">人</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </CardContent>
            </Card>

            {/* 統計摘要 */}
            <Card className="flex-shrink-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">統計摘要</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(hospitalData) as [RegionKey, typeof hospitalData.north][]).map(
                    ([regionKey, region]) => (
                      <div key={regionKey} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: region.color }} />
                          <span className="text-xs font-medium">{region.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{regionTotals[regionKey]} 人</div>
                          <div className="text-xs text-gray-500">{regionPercentages[regionKey].toFixed(1)}%</div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-sm">全國總計</span>
                  <span className="text-lg font-bold text-blue-600">{grandTotal} 人</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側：台灣地圖視覺化 - 固定在視窗內 */}
          <div className="flex flex-col overflow-hidden">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="pb-2 flex-shrink-0">
                <CardTitle className="text-base">{currentSpecialtyName} - 分區容額視覺化</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden p-3">
                <div
                  ref={mapRef}
                  className="relative flex-1 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden min-h-0"
                >
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <img
                      src="/images/264549-200.png"
                      alt="台灣地圖"
                      className="h-full w-auto object-contain opacity-60"
                    />
                  </div>

                  {/* 熱點泡泡 */}
                  {(Object.entries(bubblePositions) as [RegionKey, { top: string; left: string }][]).map(
                    ([regionKey, position]) => {
                      const size = getBubbleSize(regionKey)
                      const region = hospitalData[regionKey]
                      return (
                        <div
                          key={regionKey}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-500 ease-out shadow-lg"
                          style={{
                            top: position.top,
                            left: position.left,
                            width: `${size}px`,
                            height: `${size}px`,
                            backgroundColor: region.color,
                            opacity: 0.9,
                          }}
                        >
                          <div className="text-center text-white">
                            <div className="font-bold text-base leading-none">{regionTotals[regionKey]}</div>
                            <div className="text-xs opacity-90">{regionPercentages[regionKey].toFixed(0)}%</div>
                          </div>
                        </div>
                      )
                    },
                  )}

                  {/* 圖例 */}
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur rounded-lg p-2 shadow-sm">
                    <div className="text-xs font-medium text-gray-700 mb-1">圖例</div>
                    <div className="space-y-0.5">
                      {(Object.entries(hospitalData) as [RegionKey, typeof hospitalData.north][]).map(
                        ([regionKey, region]) => (
                          <div key={regionKey} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: region.color }} />
                            <span className="text-xs text-gray-600">{region.name}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* 總計標籤 */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-lg px-2 py-1.5 shadow-sm">
                    <div className="text-xs text-gray-500">全國總計</div>
                    <div className="text-lg font-bold text-gray-900">{grandTotal} 人</div>
                  </div>
                </div>

                {/* 比例長條圖 - 固定在底部 */}
                <div className="mt-3 pt-3 border-t flex-shrink-0">
                  <div className="text-xs font-medium text-gray-700 mb-1.5">分區比例</div>
                  <div className="flex h-5 rounded-full overflow-hidden">
                    {(Object.entries(hospitalData) as [RegionKey, typeof hospitalData.north][]).map(
                      ([regionKey, region]) => (
                        <div
                          key={regionKey}
                          className="transition-all duration-500 flex items-center justify-center"
                          style={{
                            width: `${regionPercentages[regionKey]}%`,
                            backgroundColor: region.color,
                            minWidth: regionPercentages[regionKey] > 0 ? "20px" : "0",
                          }}
                        >
                          {regionPercentages[regionKey] >= 10 && (
                            <span className="text-xs text-white font-medium">
                              {regionPercentages[regionKey].toFixed(0)}%
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                  <div className="flex justify-between mt-1.5">
                    {(Object.entries(hospitalData) as [RegionKey, typeof hospitalData.north][]).map(
                      ([regionKey, region]) => (
                        <div key={regionKey} className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: region.color }} />
                          <span className="text-xs text-gray-600">{region.name}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
