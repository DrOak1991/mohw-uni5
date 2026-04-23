"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Search } from "lucide-react"

export interface Hospital {
  code: string
  name: string
  county?: string
  district?: string
}

interface HospitalMultiSelectProps {
  hospitals: Hospital[]
  selected: string[]
  onSelect: (codes: string[]) => void
  mode?: "single" | "multiple"
  triggerLabel?: string
}

export function HospitalMultiSelect({
  hospitals,
  selected,
  onSelect,
  mode = "multiple",
  triggerLabel = "選擇醫院",
}: HospitalMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [selectedCounty, setSelectedCounty] = useState<string>("all")
  const [tempSelected, setTempSelected] = useState<string[]>(selected)

  // 提取所有縣市
  const counties = useMemo(() => {
    const unique = new Set(hospitals.map((h) => h.county).filter(Boolean))
    return Array.from(unique).sort()
  }, [hospitals])

  // 根據搜尋和篩選過濾醫院
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchSearch =
        searchText === "" ||
        h.name.includes(searchText) ||
        h.code.includes(searchText)

      const matchCounty = selectedCounty === "all" || h.county === selectedCounty

      return matchSearch && matchCounty
    })
  }, [hospitals, searchText, selectedCounty])

  const handleToggle = (code: string) => {
    if (mode === "single") {
      setTempSelected([code])
    } else {
      setTempSelected((prev) =>
        prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
      )
    }
  }

  const handleRemoveChip = (code: string) => {
    setTempSelected((prev) => prev.filter((c) => c !== code))
  }

  const handleConfirm = () => {
    onSelect(tempSelected)
    setIsOpen(false)
    setSearchText("")
    setSelectedCounty("all")
  }

  const handleCancel = () => {
    setTempSelected(selected)
    setIsOpen(false)
    setSearchText("")
    setSelectedCounty("all")
  }

  const getSelectedHospitalNames = () => {
    return selected
      .map((code) => hospitals.find((h) => h.code === code)?.name)
      .filter(Boolean)
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full justify-start text-left font-normal"
      >
        <span className="text-muted-foreground">
          {selected.length === 0
            ? triggerLabel
            : `已選擇 ${selected.length} 間醫院`}
        </span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {mode === "single" ? "選擇醫院" : "選擇醫院（可複選）"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            {/* 搜尋列 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜尋醫院名稱或機構代碼"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 縣市篩選 */}
            {counties.length > 0 && (
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選擇縣市" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部縣市</SelectItem>
                  {counties.map((county) => (
                    <SelectItem key={county} value={county || ""}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* 醫院列表 */}
            <div className="flex-1 overflow-y-auto border rounded-lg">
              <div className="divide-y">
                {filteredHospitals.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    沒有找到符合條件的醫院
                  </div>
                ) : (
                  filteredHospitals.map((hospital) => (
                    <div
                      key={hospital.code}
                      className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleToggle(hospital.code)}
                    >
                      <Checkbox
                        checked={tempSelected.includes(hospital.code)}
                        onCheckedChange={() => handleToggle(hospital.code)}
                        disabled={mode === "single" && tempSelected.length > 0 && !tempSelected.includes(hospital.code)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {hospital.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {hospital.code}
                          {hospital.county && ` • ${hospital.county}`}
                          {hospital.district && ` ${hospital.district}`}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 已選區 */}
            {tempSelected.length > 0 && (
              <div className="border-t pt-3">
                <div className="text-sm font-medium mb-2 text-muted-foreground">
                  已選擇 ({tempSelected.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {tempSelected.map((code) => {
                    const hospital = hospitals.find((h) => h.code === code)
                    return (
                      <Badge
                        key={code}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {hospital?.name}
                        <button
                          onClick={() => handleRemoveChip(code)}
                          className="ml-1 hover:bg-muted rounded"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button onClick={handleConfirm}>確認</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
