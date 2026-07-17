"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { QuotaFilingView } from "@/components/filing/quota-filing-view"

/**
 * 容額填報（獨立路由）。原為 /filing 的容額 tab，拆分後各自從 nav 進入。
 * status URL param：submitted（已送件）／returned（退件）。
 */
function QuotaFilingContent() {
  const searchParams = useSearchParams()
  const variant = searchParams.get("variant") || ""
  const status = searchParams.get("status") || ""

  return (
    <QuotaFilingView variant={variant} isSubmitted={status === "submitted"} isReturned={status === "returned"} />
  )
}

export default function QuotaFilingPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-[#f5f7fa] p-8 text-center text-muted-foreground">載入中...</div>}
    >
      <QuotaFilingContent />
    </Suspense>
  )
}
