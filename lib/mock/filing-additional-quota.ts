// 外加容額申請（填報端／醫學會視角）的 mock 來源。
// 審查端對應 lib/mock/review-additional-quota.ts 與 app/review/additional-quota；
// 兩端欄位刻意對齊：填報端填寫的「本次申請內容」即審查端檢視的內容。

export type AdditionalQuotaStatus = "草稿" | "審查中" | "已核定" | "退回修改"

export interface QuotaAttachment {
  id: string
  name: string
  size: string
}

// 本年度容額脈絡：申請時需對照現有容額與上限，判斷本次申請是否超額
export interface CurrentYearQuota {
  specialty: string
  approved: number
  limit: number
  validFrom: string
  validTo: string
}

// 前一期間資訊：唯讀，供填寫本次申請時參考
export interface PreviousPeriod {
  year: string
  quota: number
  requestReason: string
  requestDescription: string
  attachments: QuotaAttachment[]
  report: QuotaAttachment
  reviewComment: string
}

export interface AdditionalQuotaApplication {
  id: string
  hospitalName: string
  year: string
  submittedDate: string
  status: AdditionalQuotaStatus
  requestedQuota: number
  requestReason: string
  requestDescription: string
  attachments: QuotaAttachment[]
  currentYearQuota: CurrentYearQuota
  previousPeriod: PreviousPeriod
  // 僅「已核定」有值
  approvedQuota?: number
  approvedDate?: string
  // 僅「退回修改」有值：審查後要求補正的意見
  reviewFeedback?: {
    reviewDate: string
    meetingTitle: string
    fullContent: string
  }
}

function buildPreviousPeriod(specialty: string, quota: number): PreviousPeriod {
  return {
    year: "114 年度",
    quota,
    requestReason: `因應${specialty}夜間業務量增加，申請外加容額以確保值班人力充足。`,
    requestDescription: `本院${specialty} 114 年度夜間就診量較前一年成長 25%，為維持醫療品質與住院醫師訓練品質，申請外加容額 ${quota} 名。`,
    attachments: [
      { id: "p1", name: "114年度業務統計.pdf", size: "1.9 MB" },
      { id: "p2", name: "114年度訓練計畫.pdf", size: "2.1 MB" },
    ],
    report: { id: "pr1", name: "114年度外加容額成果報告書.pdf", size: "4.2 MB" },
    reviewComment: `該院於 114 年度外加容額執行成效良好，住院醫師訓練計畫完整，教學品質優良。建議持續加強臨床技能訓練與研究能力培養。`,
  }
}

export const FILING_ADDITIONAL_QUOTA_APPLICATIONS: AdditionalQuotaApplication[] = [
  {
    id: "1",
    hospitalName: "台大醫院",
    year: "115 年度",
    submittedDate: "2026/01/15",
    status: "審查中",
    requestedQuota: 5,
    requestReason: "因應本院急診醫學科業務擴展，急需增加住院醫師訓練名額以滿足臨床服務需求。",
    requestDescription:
      "本院急診醫學科近年來業務量持續成長，每日急診就診人次已達 300 人次以上。為維持醫療服務品質，並提供住院醫師完整的訓練環境，擬申請外加容額 5 名。本科現有主治醫師 15 名，具備充足的師資與教學資源，能夠提供完整的訓練計畫。",
    attachments: [
      { id: "1", name: "急診科業務量統計報告.pdf", size: "2.3 MB" },
      { id: "2", name: "師資名單與資格證明.pdf", size: "1.8 MB" },
      { id: "3", name: "訓練計畫書.pdf", size: "3.5 MB" },
    ],
    currentYearQuota: { specialty: "急診醫學科", approved: 15, limit: 25, validFrom: "2025-08-01", validTo: "2026-07-31" },
    previousPeriod: buildPreviousPeriod("急診科", 3),
  },
  {
    id: "2",
    hospitalName: "台北榮總",
    year: "115 年度",
    submittedDate: "2026/01/18",
    status: "審查中",
    requestedQuota: 3,
    requestReason: "因應本院內科住院人次成長，申請外加容額以維持訓練品質。",
    requestDescription:
      "本院內科近三年住院人次成長 18%，現有訓練容額已無法涵蓋各次專科輪訓需求。擬申請外加容額 3 名，本科現有主治醫師 22 名，師資充足。",
    attachments: [
      { id: "1", name: "內科住院人次統計.pdf", size: "1.5 MB" },
      { id: "2", name: "師資名單.pdf", size: "0.9 MB" },
    ],
    currentYearQuota: { specialty: "內科", approved: 20, limit: 25, validFrom: "2025-08-01", validTo: "2026-07-31" },
    previousPeriod: buildPreviousPeriod("內科", 2),
  },
  {
    id: "3",
    hospitalName: "長庚醫院",
    year: "115 年度",
    submittedDate: "2026/01/20",
    status: "已核定",
    requestedQuota: 4,
    approvedQuota: 3,
    approvedDate: "2026/02/15",
    requestReason: "因應外科手術量成長，申請外加容額以充實訓練人力。",
    requestDescription: "本院外科年手術量已達 12,000 台，為提供住院醫師充足的手術訓練機會，擬申請外加容額 4 名。",
    attachments: [{ id: "1", name: "外科手術量統計.pdf", size: "2.0 MB" }],
    currentYearQuota: { specialty: "外科", approved: 12, limit: 20, validFrom: "2025-08-01", validTo: "2026-07-31" },
    previousPeriod: buildPreviousPeriod("外科", 3),
  },
  {
    id: "4",
    hospitalName: "馬偕醫院",
    year: "114 年度",
    submittedDate: "2025/01/10",
    status: "已核定",
    requestedQuota: 2,
    approvedQuota: 2,
    approvedDate: "2025/02/20",
    requestReason: "因應兒科夜間急診需求，申請外加容額。",
    requestDescription: "本院兒科夜間急診量穩定成長，擬申請外加容額 2 名以確保值班人力。",
    attachments: [{ id: "1", name: "兒科急診統計.pdf", size: "1.2 MB" }],
    currentYearQuota: { specialty: "兒科", approved: 8, limit: 12, validFrom: "2024-08-01", validTo: "2025-07-31" },
    previousPeriod: buildPreviousPeriod("兒科", 1),
  },
  {
    id: "5",
    hospitalName: "中國醫藥大學附設醫院",
    year: "115 年度",
    submittedDate: "2026/01/22",
    status: "退回修改",
    requestedQuota: 3,
    requestReason: "因應麻醉科業務擴展，申請外加容額。",
    requestDescription: "本院麻醉科業務量成長，擬申請外加容額 3 名。",
    attachments: [{ id: "1", name: "麻醉科業務統計.pdf", size: "1.1 MB" }],
    currentYearQuota: { specialty: "麻醉科", approved: 10, limit: 14, validFrom: "2025-08-01", validTo: "2026-07-31" },
    previousPeriod: buildPreviousPeriod("麻醉科", 2),
    // 退回理由不涉及超過容額上限 —— 上限由前端硬性擋下，超額的申請送不出來，
    // 因此不可能出現在審查階段
    reviewFeedback: {
      reviewDate: "115/02/06",
      meetingTitle: "115年度第一次外加容額審查會議",
      fullContent: `一、會議時間：115年2月6日（星期五）上午10時

二、會議地點：衛生福利部第三會議室

三、主席：○○○司長
    紀錄：○○○

四、出席人員：（略）

五、審查意見：

（一）申請說明過於簡略，僅稱「業務量成長」而未提供具體數據。
    請補充近三年麻醉科手術台數、麻醉人次之統計資料，並與現有容額對照說明。

（二）未檢附師資名單與資格證明。依規定申請外加容額應具備對應之師資，
    請補齊相關文件，並敘明各師資之專科證書字號與指導年資。

（三）申請緣由未說明現有 10 名容額之運用情形。
    請補充近二年容額使用率與訓練完成率，以佐證增額之必要性。

六、散會：上午11時20分`,
    },
  },
  {
    id: "6",
    hospitalName: "成大醫院",
    year: "115 年度",
    submittedDate: "—",
    status: "草稿",
    requestedQuota: 0,
    requestReason: "",
    requestDescription: "",
    attachments: [],
    currentYearQuota: { specialty: "神經科", approved: 6, limit: 10, validFrom: "2025-08-01", validTo: "2026-07-31" },
    previousPeriod: buildPreviousPeriod("神經科", 1),
  },
]

export const ADDITIONAL_QUOTA_STATUS_CONFIG: Record<AdditionalQuotaStatus, { color: string; label: string }> = {
  草稿: { color: "bg-gray-100 text-gray-700 border-gray-200", label: "草稿" },
  審查中: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "審查中" },
  已核定: { color: "bg-green-100 text-green-700 border-green-200", label: "已核定" },
  退回修改: { color: "bg-red-100 text-red-700 border-red-200", label: "退回修改" },
}

export function getAdditionalQuotaApplication(id: string): AdditionalQuotaApplication | undefined {
  return FILING_ADDITIONAL_QUOTA_APPLICATIONS.find((a) => a.id === id)
}

/** 草稿與退回修改可編輯；審查中與已核定僅供檢視。 */
export function isAdditionalQuotaEditable(status: AdditionalQuotaStatus): boolean {
  return status === "草稿" || status === "退回修改"
}
