'use client'

import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type PageStateBaseProps = {
  title?: string
  description?: string
}

type PageStateProps = PageStateBaseProps & {
  actionLabel?: string
  onActionClick?: () => void
}

export function PageLoading({
  title = '頁面載入中',
  description = '資料讀取中，請稍候…',
}: PageStateBaseProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center space-y-1">
          <p className="text-base font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function PageEmpty({
  title = '目前沒有資料',
  description = '請調整篩選條件，或稍後再試一次。',
  actionLabel,
  onActionClick,
}: PageStateProps) {
  return (
    <div className="py-12">
      <Empty className="border border-dashed border-border bg-background/60">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        {actionLabel && onActionClick && (
          <EmptyContent>
            <Button size="sm" onClick={onActionClick}>
              {actionLabel}
            </Button>
          </EmptyContent>
        )}
      </Empty>
    </div>
  )
}

export function PageError({
  title = '發生錯誤',
  description = '系統暫時無法完成此操作，請稍後再試或聯絡系統管理員。',
  actionLabel,
  onActionClick,
}: PageStateProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-muted/30 px-4">
      <div className="max-w-md space-y-4 rounded-lg border border-destructive/20 bg-background p-6 text-center shadow-sm">
        <div className="flex justify-center">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLabel && onActionClick && (
          <div className="flex justify-center">
            <Button size="sm" onClick={onActionClick}>
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

