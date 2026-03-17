"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, X, Tag } from "lucide-react"

export interface RevisionReason {
  id: string
  label: string
  color: string
}

export interface RevisionItem {
  id: string
  sectionId: string
  sectionTitle: string
  oldText: string
  newText: string
  reasonId: string | null
}

interface RevisionReasonPanelProps {
  reasons: RevisionReason[]
  revisions: RevisionItem[]
  onAddReason: (label: string) => void
  onRemoveReason: (id: string) => void
  onAssignReason: (revisionId: string, reasonId: string | null) => void
  onSelectRevision: (revisionId: string) => void
  selectedRevisionId: string | null
}

const defaultColors = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-amber-100 text-amber-800 border-amber-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-rose-100 text-rose-800 border-rose-200",
]

export function RevisionReasonPanel({
  reasons,
  revisions,
  onAddReason,
  onRemoveReason,
  onAssignReason,
  onSelectRevision,
  selectedRevisionId,
}: RevisionReasonPanelProps) {
  const [newReasonText, setNewReasonText] = useState("")
  const [isAddingReason, setIsAddingReason] = useState(false)

  const assignedCount = revisions.filter((r) => r.reasonId !== null).length
  const pendingCount = revisions.filter((r) => r.reasonId === null).length

  const handleAddReason = () => {
    if (newReasonText.trim()) {
      onAddReason(newReasonText.trim())
      setNewReasonText("")
      setIsAddingReason(false)
    }
  }

  const getReasonColor = (index: number) => {
    return defaultColors[index % defaultColors.length]
  }

  return (
    <div className="w-72 shrink-0">
      <div className="bg-card rounded-lg p-4 sticky top-4">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">修訂原因標籤</span>
        </div>

        {/* Reason Tags */}
        <div className="space-y-2 mb-4">
          {reasons.map((reason, index) => (
            <div
              key={reason.id}
              className={`flex items-center justify-between px-3 py-2 rounded-md border ${getReasonColor(index)}`}
            >
              <span className="text-sm font-medium truncate">{reason.label}</span>
              <button
                onClick={() => onRemoveReason(reason.id)}
                className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {isAddingReason ? (
            <div className="flex gap-2">
              <Input
                value={newReasonText}
                onChange={(e) => setNewReasonText(e.target.value)}
                placeholder="輸入原因..."
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddReason()
                  if (e.key === "Escape") setIsAddingReason(false)
                }}
              />
              <Button size="sm" className="h-8 px-2" onClick={handleAddReason}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingReason(true)}
              className="flex items-center gap-1 text-primary text-sm hover:underline"
            >
              <Plus className="h-4 w-4" />
              新增原因
            </button>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground mb-3">
            本文件修訂 <span className="font-medium text-foreground">{revisions.length}</span> 處
          </div>
          <div className="flex gap-4 text-xs mb-4">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">已標註：{assignedCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              <span className="text-muted-foreground">待標註：{pendingCount}</span>
            </div>
          </div>

          {/* Revision List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {revisions.map((revision) => (
              <div
                key={revision.id}
                onClick={() => onSelectRevision(revision.id)}
                className={`p-2 rounded-md border cursor-pointer transition-colors ${
                  selectedRevisionId === revision.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground truncate">
                    {revision.sectionTitle}
                  </span>
                  {revision.reasonId === null && (
                    <span className="h-2 w-2 rounded-full bg-orange-400 shrink-0" />
                  )}
                </div>
                <Select
                  value={revision.reasonId || ""}
                  onValueChange={(value) =>
                    onAssignReason(revision.id, value || null)
                  }
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="選擇原因..." />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((reason) => (
                      <SelectItem key={reason.id} value={reason.id}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {revisions.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                尚無修訂內容
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
