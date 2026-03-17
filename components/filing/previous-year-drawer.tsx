"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, X } from "lucide-react"

export interface PreviousYearSection {
  id: string
  title: string
  content: string
}

interface PreviousYearDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  year: string
  sections: PreviousYearSection[]
  onCopyContent: (sectionId: string, content: string) => void
  currentSectionId?: string
}

export function PreviousYearDrawer({
  open,
  onOpenChange,
  year,
  sections,
  onCopyContent,
  currentSectionId,
}: PreviousYearDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">{year} 年度內容</SheetTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            參考前一年度的填報內容，可複製到編輯區域
          </p>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-4 space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`rounded-lg border ${
                  currentSectionId === section.id
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                  <span className="font-medium text-sm">{section.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => onCopyContent(section.id, section.content)}
                  >
                    <Copy className="h-3 w-3" />
                    複製到編輯區
                  </Button>
                </div>
                <div className="p-4">
                  {section.content ? (
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {section.content}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      此章節去年無內容
                    </p>
                  )}
                </div>
              </div>
            ))}

            {sections.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                無前一年度資料
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
