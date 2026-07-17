"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { QuotaFilingView } from "@/components/filing/quota-filing-view"
import { isValidQuotaFilingStage, type QuotaFilingStage } from "@/lib/mock/quota-filing-stage"

/**
 * 容額填報（獨立路由）。單頁工作流，依階段決定可編輯範圍。
 * URL param：
 *   stage        — 案件階段（待送件／醫策會初審／分組會議／RRC大會／待公告／已公告），預設待送件
 *   returnedFrom — 退件來源階段（有值代表退件，醫學會補正重送）
 *   variant      — 版型（internal-medicine 有結核病計畫容額）
 */
function QuotaFilingContent() {
  const searchParams = useSearchParams()
  const variant = searchParams.get("variant") || ""

  const stageParam = searchParams.get("stage") || ""
  const stage: QuotaFilingStage = isValidQuotaFilingStage(stageParam) ? stageParam : "待送件"

  const returnedFromParam = searchParams.get("returnedFrom") || ""
  const returnedFrom = isValidQuotaFilingStage(returnedFromParam) ? returnedFromParam : null

  return <QuotaFilingView variant={variant} stage={stage} returnedFrom={returnedFrom} />
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
