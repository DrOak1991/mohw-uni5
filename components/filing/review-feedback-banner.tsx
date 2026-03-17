"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"

export interface ReviewFeedback {
  reviewDate: string
  comments: string[]
}

interface ReviewFeedbackBannerProps {
  feedback: ReviewFeedback
  defaultExpanded?: boolean
}

export function ReviewFeedbackBanner({
  feedback,
  defaultExpanded = true,
}: ReviewFeedbackBannerProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <span className="font-medium text-amber-800">本文件已被退回修改</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-amber-700">
            審查日期：{feedback.reviewDate} | 審查意見共 {feedback.comments.length} 點
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-amber-700 hover:text-amber-800 hover:bg-amber-100"
          >
            {isExpanded ? (
              <>
                收合審查意見
                <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                展開審查意見
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-amber-200 bg-amber-50/50">
          <div className="pt-3">
            <div className="text-sm font-medium text-amber-800 mb-2">審查意見：</div>
            <ol className="list-decimal list-inside space-y-1">
              {feedback.comments.map((comment, index) => (
                <li key={index} className="text-sm text-amber-900 leading-relaxed">
                  {comment}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
