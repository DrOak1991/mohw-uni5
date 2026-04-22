"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { FilingItemConfig } from "@/lib/mock/review-outline"

interface FilingScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: FilingItemConfig
}

export function FilingScheduleDialog({
  open,
  onOpenChange,
  item,
}: FilingScheduleDialogProps) {
  const [mode, setMode] = useState<"scheduled" | "manual">(
    item.isScheduled ? "scheduled" : "manual"
  )
  const [startDate, setStartDate] = useState(item.openingDate?.split(" ")[0] || "")
  const [startTime, setStartTime] = useState(item.openingDate?.split(" ")[1] || "09:00")
  const [endDate, setEndDate] = useState(item.closingDate?.split(" ")[0] || "")
  const [endTime, setEndTime] = useState(item.closingDate?.split(" ")[1] || "17:00")
  const [manualStatus, setManualStatus] = useState<"open" | "closed">(
    item.status === "open" ? "open" : "closed"
  )

  const handleSave = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>填報開放設定</DialogTitle>
          <DialogDescription>{item.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mode Selection */}
          <RadioGroup
            value={mode}
            onValueChange={(value) => setMode(value as "scheduled" | "manual")}
          >
            <div className="space-y-4">
              {/* Scheduled Mode */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled" className="font-medium cursor-pointer">
                    排程開放
                  </Label>
                </div>

                {mode === "scheduled" && (
                  <div className="ml-6 space-y-3 p-3 bg-blue-50 rounded-lg">
                    <div>
                      <Label className="text-xs text-gray-600">開始日期</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="text-sm w-28"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">結束日期</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="text-sm w-28"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Mode */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual" className="font-medium cursor-pointer">
                    手動控制
                  </Label>
                </div>

                {mode === "manual" && (
                  <div className="ml-6 space-y-2 p-3 bg-gray-50 rounded-lg">
                    <RadioGroup
                      value={manualStatus}
                      onValueChange={(value) => setManualStatus(value as "open" | "closed")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="open" id="open" />
                        <Label htmlFor="open" className="text-sm cursor-pointer">
                          ● 開放中
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="closed" id="closed" />
                        <Label htmlFor="closed" className="text-sm cursor-pointer">
                          ○ 未開放
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave} className="bg-primary">
            儲存設定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
