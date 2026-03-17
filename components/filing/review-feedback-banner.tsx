"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AlertTriangle, FileText } from "lucide-react"

export interface ReviewFeedback {
  reviewDate: string
  meetingTitle?: string
  comments: string[]
  fullContent?: string // For large meeting minutes
}

interface ReviewFeedbackBannerProps {
  feedback: ReviewFeedback
}

export function ReviewFeedbackBanner({
  feedback,
}: ReviewFeedbackBannerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <span className="font-medium text-amber-800">本文件已被退回修改</span>
          <span className="text-sm text-amber-700 ml-2">
            審查日期：{feedback.reviewDate}
          </span>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
            >
              <FileText className="h-4 w-4 mr-1" />
              查看審查意見
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[500px] sm:w-[600px] sm:max-w-[600px] overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                審查意見
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">審查日期</span>
                    <p className="font-medium text-foreground">{feedback.reviewDate}</p>
                  </div>
                  {feedback.meetingTitle && (
                    <div>
                      <span className="text-muted-foreground">會議名稱</span>
                      <p className="font-medium text-foreground">{feedback.meetingTitle}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">審查意見內容</h4>
                {feedback.fullContent ? (
                  <div className="prose prose-sm max-w-none bg-white rounded-lg border p-4">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {feedback.fullContent}
                    </div>
                  </div>
                ) : (
                  <ol className="list-decimal list-inside space-y-3 bg-white rounded-lg border p-4">
                    {feedback.comments.map((comment, index) => (
                      <li key={index} className="text-sm text-foreground leading-relaxed pl-2">
                        <span className="ml-1">{comment}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
