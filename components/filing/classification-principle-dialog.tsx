"use client"

import { useState } from "react"
import { Plus, X, Pencil, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { ClassificationPrinciple } from "@/lib/mock/additional-quota"

interface ClassificationPrincipleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  options: ClassificationPrinciple[]
  onChange: (next: ClassificationPrinciple[]) => void
}

/**
 * 分類原則選項的維護彈窗（新增／改名／刪除／切換「需成果報告」）。
 * 「需成果報告」開關決定該分類原則的外加容額案件公告滿一年後是否需提交成果報告，
 * 跟著原則走而非在程式硬比對名稱，避免改名導致成果報告追蹤失聯。
 */
export function ClassificationPrincipleDialog({
  open,
  onOpenChange,
  options,
  onChange,
}: ClassificationPrincipleDialogProps) {
  const [newValue, setNewValue] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState("")

  const handleAdd = () => {
    const value = newValue.trim()
    if (!value || options.some((o) => o.name === value)) return
    onChange([...options, { name: value, requiresOutcomeReport: false }])
    setNewValue("")
  }

  const handleRemove = (index: number) => onChange(options.filter((_, i) => i !== index))

  const handleToggleReport = (index: number) =>
    onChange(options.map((o, i) => (i === index ? { ...o, requiresOutcomeReport: !o.requiresOutcomeReport } : o)))

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditingValue(options[index].name)
  }

  const commitEdit = () => {
    const value = editingValue.trim()
    if (editingIndex === null) return
    if (value && !options.some((o, i) => o.name === value && i !== editingIndex)) {
      onChange(options.map((o, i) => (i === editingIndex ? { ...o, name: value } : o)))
    }
    setEditingIndex(null)
    setEditingValue("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>管理分類原則選項</DialogTitle>
          <DialogDescription>
            新增、修改或刪除分類原則。「需成果報告」開啟時，該原則的案件公告滿一年後需提交外加容額成果報告。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
            >
              {editingIndex === index ? (
                <>
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="h-8 bg-white"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit()
                      if (e.key === "Escape") setEditingIndex(null)
                    }}
                  />
                  <Button size="sm" variant="ghost" className="h-8 shrink-0 px-2" onClick={commitEdit}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="min-w-0 flex-1 truncate text-sm text-gray-900">{option.name}</span>
                  <label className="flex shrink-0 items-center gap-1.5 text-xs text-gray-500">
                    需成果報告
                    <Switch
                      checked={option.requiresOutcomeReport}
                      onCheckedChange={() => handleToggleReport(index)}
                    />
                  </label>
                  <div className="flex shrink-0 items-center">
                    <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => startEdit(index)}>
                      <Pencil className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => handleRemove(index)}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          {options.length === 0 && (
            <p className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
              尚無分類原則，請於下方新增
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 border-t pt-4">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="輸入新的分類原則..."
            className="h-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd()
            }}
          />
          <Button onClick={handleAdd} className="h-9 shrink-0 gap-1" disabled={!newValue.trim()}>
            <Plus className="h-4 w-4" />
            新增
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            完成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
