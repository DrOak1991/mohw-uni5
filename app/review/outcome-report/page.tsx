"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronRight, ClipboardCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ReviewSimpleNav } from "@/components/review/simple-nav"
import {
  OUTCOME_REPORT_STAGE_CONFIG,
  OUTCOME_REPORT_TYPES,
  PRELIMINARY_REVIEW_CONFIG,
  getOutcomeReportReviewCases,
  getOutcomeReportStageCounts,
  getSocietyName,
  type OutcomeReportType,
} from "@/lib/mock/outcome-report"

/**
 * 成果報告審查（醫事司視角）。
 * 與填報端 /filing/outcome-report 共用同一份案件資料，差異在於：
 * 醫事司不上傳成果報告，且看不到待填寫的案件 —— 醫策會尚未上傳者對醫事司無意義。
 */
export default function OutcomeReportReviewPage() {
  const [activeType, setActiveType] = useState<OutcomeReportType>("quota")
  const [stageFilter, setStageFilter] = useState<string>("all")

  const cases = useMemo(() => getOutcomeReportReviewCases(activeType), [activeType])
  const stageCounts = useMemo(() => getOutcomeReportStageCounts(activeType, cases), [activeType, cases])
  const filtered = useMemo(
    () => (stageFilter === "all" ? cases : cases.filter((c) => c.stage === stageFilter)),
    [cases, stageFilter],
  )

  const handleTypeChange = (value: string) => {
    setActiveType(value as OutcomeReportType)
    setStageFilter("all")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewSimpleNav />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">成果報告審查</h1>
          <p className="mt-1 text-base text-gray-500">
            審查醫策會提送之各專科醫學會成果報告，通過後由系統自動歸檔
          </p>
        </div>

        <Tabs value={activeType} onValueChange={handleTypeChange} className="w-full">
          <TabsList className="mb-6 h-11">
            {OUTCOME_REPORT_TYPES.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="px-5 text-base">
                {t.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {OUTCOME_REPORT_TYPES.map((t) => (
            <TabsContent key={t.id} value={t.id} className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-gray-900">{t.name}</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      醫策會已提送 {cases.length} 件
                    </p>
                  </div>

                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Button
                      variant={stageFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStageFilter("all")}
                    >
                      全部 {cases.length}
                    </Button>
                    {stageCounts.map(({ stage, count }) => (
                      <Button
                        key={stage}
                        variant={stageFilter === stage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStageFilter(stage)}
                      >
                        {stage} {count}
                      </Button>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>專科醫學會</TableHead>
                          <TableHead className="w-32">階段</TableHead>
                          <TableHead className="w-32">醫策會初審</TableHead>
                          <TableHead className="w-28" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((c) => (
                          <TableRow key={c.societyId}>
                            <TableCell className="font-medium text-gray-900">{getSocietyName(c.societyId)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={OUTCOME_REPORT_STAGE_CONFIG[c.stage].color}>
                                {OUTCOME_REPORT_STAGE_CONFIG[c.stage].label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {c.preliminaryReview ? (
                                <Badge
                                  variant="outline"
                                  className={PRELIMINARY_REVIEW_CONFIG[c.preliminaryReview].color}
                                >
                                  {PRELIMINARY_REVIEW_CONFIG[c.preliminaryReview].label}
                                </Badge>
                              ) : (
                                <span className="text-sm text-gray-400">尚未初審</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  href={`/review/outcome-report/${c.societyId}?type=${c.type}`}
                                  className="flex items-center gap-1"
                                >
                                  <ClipboardCheck className="h-4 w-4" />
                                  審查
                                  <ChevronRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filtered.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="py-12 text-center text-gray-500">
                              此階段目前沒有案件
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
