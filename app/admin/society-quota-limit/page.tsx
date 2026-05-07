"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { societyQuotaLimits, type SocietyQuotaLimit } from "@/lib/mock/society-quota-limits"

export default function SocietyQuotaLimitPage() {
  const [limits, setLimits] = useState<SocietyQuotaLimit[]>(societyQuotaLimits)
  const [editingValues, setEditingValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(societyQuotaLimits.map((s) => [s.societyId, s.totalLimit?.toString() ?? ""]))
  )
  const [hasUnsaved, setHasUnsaved] = useState(false)

  const unsetCount = useMemo(
    () => limits.filter((s) => !editingValues[s.societyId] || editingValues[s.societyId] === "").length,
    [limits, editingValues]
  )

  const handleChange = (societyId: string, value: string) => {
    // Only allow positive integers
    if (value !== "" && (!/^\d+$/.test(value) || Number(value) < 1)) return
    setEditingValues((prev) => ({ ...prev, [societyId]: value }))
    setHasUnsaved(true)
  }

  const handleSave = () => {
    setLimits((prev) =>
      prev.map((s) => ({
        ...s,
        totalLimit: editingValues[s.societyId] ? Number(editingValues[s.societyId]) : null,
        updatedAt: editingValues[s.societyId] ? new Date().toLocaleDateString("zh-TW") : s.updatedAt,
        updatedBy: editingValues[s.societyId] ? "目前使用者" : s.updatedBy,
      }))
    )
    setHasUnsaved(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/outline-management"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回填報項目管理
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">容額總上限設定</h1>
              <p className="text-sm text-gray-500 mt-1">
                設定各專科醫學會旗下所有訓練醫院可填報的容額總和上限
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={!hasUnsaved}
              className="gap-2 bg-[#2d3a8c] hover:bg-[#252f73] text-white"
            >
              <Save className="h-4 w-4" />
              儲存所有變更
            </Button>
          </div>
        </div>

        {/* Warning if unsaved */}
        {hasUnsaved && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-sm text-amber-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            您有未儲存的變更，請記得點擊「儲存所有變更」。
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">專科醫學會</th>
                <th className="text-center px-5 py-3 text-sm font-semibold text-gray-500 uppercase tracking-wide w-44">容額申請總上限</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500 uppercase tracking-wide w-36">上次更新</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {limits.map((society, index) => {
                const value = editingValues[society.societyId]
                const isUnset = !value || value === ""
                return (
                  <tr
                    key={society.societyId}
                    className={`transition-colors ${isUnset ? "bg-amber-50/40 hover:bg-amber-50" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-5 py-3 text-sm text-gray-400">{index + 1}</td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-gray-900">{society.societyName}</span>
                      {isUnset && (
                        <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200 text-sm">未設定</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center">
                        <Input
                          type="number"
                          min={1}
                          value={value}
                          onChange={(e) => handleChange(society.societyId, e.target.value)}
                          placeholder="輸入數字"
                          className={`w-28 text-center h-8 text-sm ${isUnset ? "border-amber-300 focus-visible:ring-amber-400" : ""}`}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {society.updatedAt ? (
                        <div>
                          <p className="text-sm text-gray-600">{society.updatedAt}</p>
                          <p className="text-sm text-gray-400">{society.updatedBy}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
