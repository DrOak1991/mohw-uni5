"use client"

import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReviewSimpleNav } from "@/components/review/simple-nav"

const outlineItems = [
  {
    id: "screening-principle",
    name: "\u7504\u5BE9\u539F\u5247",
    description: "\u5167\u79D1\u5C08\u79D1\u91AB\u5E2B\u7504\u5BE9\u7684\u57FA\u672C\u539F\u5247\u548C\u8CC7\u683C\u8981\u6C42",
  },
  {
    id: "hospital-accreditation",
    name: "\u8A13\u7DF4\u91AB\u9662\u8A8D\u5B9A\u57FA\u6E96",
    description: "\u8A13\u7DF4\u91AB\u9662\u8A8D\u5B9A\u548C\u7BA1\u7406\u7684\u6A19\u6E96",
  },
  {
    id: "training-curriculum",
    name: "\u8A13\u7DF4\u8AB2\u7A0B\u57FA\u6E96",
    description: "\u8A13\u7DF4\u8AB2\u7A0B\u8A2D\u7F6E\u548C\u5167\u5BB9\u7684\u57FA\u672C\u8981\u6C42",
  },
  {
    id: "evaluation-standards",
    name: "\u8A55\u6838\u6A19\u6E96\u8207\u8A55\u6838\u8868",
    description: "\u5C08\u79D1\u91AB\u5E2B\u8A13\u7DF4\u7684\u8A55\u6838\u6A19\u6E96\u548C\u8868\u683C",
  },
  {
    id: "quota-allocation",
    name: "\u5BB9\u984D\u5206\u914D\u539F\u5247",
    description: "\u57F9\u8A13\u5BB9\u984D\u5206\u914D\u7684\u539F\u5247\u548C\u65B9\u6CD5",
  },
]

export default function OutlineManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewSimpleNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">自定義大綱管理</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_auto] items-center px-6 py-3 border-b border-gray-200 bg-gray-50">
            <span className="text-sm font-medium text-gray-500">項目名稱</span>
            <span className="text-sm font-medium text-gray-500">操作</span>
          </div>

          <div className="divide-y divide-gray-200">
            {outlineItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_auto] items-center px-6 py-5"
              >
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/review/outline-management/${item.id}`} className="flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                    編輯
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
