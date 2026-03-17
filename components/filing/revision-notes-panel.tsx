"use client"

import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export interface SectionRevisionNote {
  sectionId: string
  sectionTitle: string
  hasChanges: boolean
  note: string
}

interface RevisionNotesPanelProps {
  notes: SectionRevisionNote[]
  onNoteChange: (sectionId: string, note: string) => void
  activeSectionId?: string
  onSectionClick?: (sectionId: string) => void
  applyToAll?: {
    enabled: boolean
    note: string
  }
  onApplyToAllChange?: (enabled: boolean, note: string) => void
}

export function RevisionNotesPanel({
  notes,
  onNoteChange,
  activeSectionId,
  onSectionClick,
  applyToAll,
  onApplyToAllChange,
}: RevisionNotesPanelProps) {
  const sectionsWithChanges = notes.filter((n) => n.hasChanges)
  const notesFilledCount = sectionsWithChanges.filter((n) => n.note.trim() !== "").length
  const pendingCount = sectionsWithChanges.length - notesFilledCount

  return (
    <div className="w-80 shrink-0">
      <div className="bg-card rounded-lg p-4 sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">修訂說明</span>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              {notesFilledCount}
            </span>
            {pendingCount > 0 && (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-3 w-3" />
                {pendingCount}
              </span>
            )}
          </div>
        </div>

        {/* Apply to All Section */}
        {applyToAll && onApplyToAllChange && sectionsWithChanges.length > 1 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2 mb-2">
              <Checkbox
                id="apply-to-all"
                checked={applyToAll.enabled}
                onCheckedChange={(checked) =>
                  onApplyToAllChange(!!checked, applyToAll.note)
                }
              />
              <label
                htmlFor="apply-to-all"
                className="text-xs font-medium text-blue-800 cursor-pointer leading-tight"
              >
                套用統一說明到所有修訂處
              </label>
            </div>
            {applyToAll.enabled && (
              <Textarea
                value={applyToAll.note}
                onChange={(e) => onApplyToAllChange(true, e.target.value)}
                placeholder="輸入統一的修訂說明..."
                className="min-h-16 text-sm bg-white"
              />
            )}
          </div>
        )}

        {/* Section Notes List */}
        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
          {sectionsWithChanges.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              目前無修訂內容
            </div>
          ) : (
            sectionsWithChanges.map((section) => {
              const isActive = activeSectionId === section.sectionId
              const isFilled = section.note.trim() !== ""
              const isUsingGlobalNote = applyToAll?.enabled

              return (
                <div
                  key={section.sectionId}
                  className={`rounded-lg border transition-colors ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div
                    className="flex items-center justify-between px-3 py-2 cursor-pointer"
                    onClick={() => onSectionClick?.(section.sectionId)}
                  >
                    <span className="text-xs font-medium text-foreground truncate">
                      {section.sectionTitle}
                    </span>
                    {!isUsingGlobalNote && (
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          isFilled ? "bg-green-500" : "bg-amber-400"
                        }`}
                      />
                    )}
                  </div>
                  {!isUsingGlobalNote && (
                    <div className="px-3 pb-3">
                      <Textarea
                        value={section.note}
                        onChange={(e) =>
                          onNoteChange(section.sectionId, e.target.value)
                        }
                        placeholder="請說明此處修訂原因..."
                        className="min-h-16 text-sm resize-none"
                      />
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Summary Footer */}
        {sectionsWithChanges.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              共 <span className="font-medium text-foreground">{sectionsWithChanges.length}</span> 個條文有修訂
            </div>
            {pendingCount > 0 && !applyToAll?.enabled && (
              <div className="mt-1 text-xs text-amber-600">
                尚有 {pendingCount} 處未填寫說明
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
