import { allSocieties } from "@/lib/data/societies"

// 成果報告上傳（填報端／醫策會視角）的 mock 來源。
//
// 業務流程：專科醫學會提交成果報告（系統外），醫策會代為上傳並進行初步審查，
// 再交由醫事司審查核定。醫事司通過後系統自動歸檔，無公告步驟。
//
// 狀態為兩個獨立的軸：
//  - stage 是案件位置：待填寫 → 待審查 → 已歸檔
//  - preliminaryReview 是醫策會初審結果的標註，不會移動案件。
//    「待補件」代表初審未過，案件仍停在待審查，等醫策會向醫學會取得新文件後重傳。
// 因此初審評論的業務用途是「醫策會向醫事司說明初步審查結果」，
// 而非退回給醫學會 —— 系統內沒有醫學會的操作者。

export type OutcomeReportType = "quota" | "additional-quota"
export type OutcomeReportStage = "待填寫" | "待審查" | "已歸檔"
export type PreliminaryReviewResult = "通過" | "待補件"

export const OUTCOME_REPORT_TYPES: Array<{ id: OutcomeReportType; name: string }> = [
  { id: "quota", name: "容額成果報告" },
  { id: "additional-quota", name: "外加容額成果報告" },
]

export const OUTCOME_REPORT_STAGE_CONFIG: Record<OutcomeReportStage, { color: string; label: string }> = {
  待填寫: { color: "bg-gray-100 text-gray-600 border-gray-200", label: "待填寫" },
  待審查: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "待審查" },
  已歸檔: { color: "bg-green-100 text-green-700 border-green-200", label: "已歸檔" },
}

export const PRELIMINARY_REVIEW_CONFIG: Record<PreliminaryReviewResult, { color: string; label: string }> = {
  通過: { color: "bg-green-100 text-green-700 border-green-200", label: "初審通過" },
  待補件: { color: "bg-orange-100 text-orange-700 border-orange-200", label: "待補件" },
}

export interface OutcomeReportFile {
  id: string
  name: string
  size: string
}

export interface OutcomeReportCase {
  societyId: string
  type: OutcomeReportType
  stage: OutcomeReportStage
  reports: OutcomeReportFile[]
  uploadedDate: string | null
  // 醫策會初步審查
  preliminaryReview: PreliminaryReviewResult | null
  reviewComment: string
  reviewMinutes: OutcomeReportFile[]
}

const REPORT_TYPE_LABEL: Record<OutcomeReportType, string> = {
  quota: "容額成果報告",
  "additional-quota": "外加容額成果報告",
}

// 依醫學會與報告類型產生擬真案件；讓 25 筆分布於不同階段與初審結果，
// 反映實務上進度不一的狀態
function buildCase(societyId: string, societyName: string, type: OutcomeReportType, index: number): OutcomeReportCase {
  const label = REPORT_TYPE_LABEL[type]
  // 外加容額成果報告的提交率較低，刻意讓待填寫的比例高一些
  const offset = type === "additional-quota" ? 1 : 0
  const bucket = (index + offset) % 5

  if (bucket === 0) {
    return {
      societyId,
      type,
      stage: "待填寫",
      reports: [],
      uploadedDate: null,
      preliminaryReview: null,
      reviewComment: "",
      reviewMinutes: [],
    }
  }

  const reports: OutcomeReportFile[] = [
    { id: `${societyId}-${type}-1`, name: `${societyName}_114年度${label}.pdf`, size: "3.8 MB" },
    { id: `${societyId}-${type}-2`, name: `${societyName}_114年度${label}_附件一_訓練成效統計.pdf`, size: "2.1 MB" },
  ]
  if (bucket >= 3) {
    reports.push({
      id: `${societyId}-${type}-3`,
      name: `${societyName}_114年度${label}_附件二_訓練醫院清冊.xlsx`,
      size: "0.9 MB",
    })
  }

  if (bucket === 1) {
    // 已上傳但尚未初審
    return {
      societyId,
      type,
      stage: "待審查",
      reports,
      uploadedDate: "115/01/12",
      preliminaryReview: null,
      reviewComment: "",
      reviewMinutes: [],
    }
  }

  if (bucket === 2) {
    // 初審未過，案件不移動，等醫學會補件後重傳
    return {
      societyId,
      type,
      stage: "待審查",
      reports,
      uploadedDate: "115/01/09",
      preliminaryReview: "待補件",
      reviewComment: `經初步審查，${societyName}所提${label}之訓練成效統計未涵蓋全部訓練醫院，缺漏 3 家。已請該學會補齊後重新提送，補件到齊後將重新上傳。`,
      reviewMinutes: [
        { id: `${societyId}-${type}-m1`, name: `115年度第一次成果報告初審會議紀錄.pdf`, size: "1.4 MB" },
      ],
    }
  }

  if (bucket === 3) {
    // 初審通過，待醫事司審查
    return {
      societyId,
      type,
      stage: "待審查",
      reports,
      uploadedDate: "115/01/05",
      preliminaryReview: "通過",
      reviewComment: `經初步審查，${societyName}所提${label}內容完整，訓練成效統計與訓練醫院清冊相符，各項指標達成率均符合規定。建議提送醫事司審查。`,
      reviewMinutes: [
        { id: `${societyId}-${type}-m1`, name: `115年度第一次成果報告初審會議紀錄.pdf`, size: "1.4 MB" },
      ],
    }
  }

  // 醫事司審查通過後由系統自動歸檔
  return {
    societyId,
    type,
    stage: "已歸檔",
    reports,
    uploadedDate: "114/12/20",
    preliminaryReview: "通過",
    reviewComment: `經初步審查，${societyName}所提${label}內容完整，訓練品質指標達成情形良好，無須補正。建議提送醫事司審查。`,
    reviewMinutes: [{ id: `${societyId}-${type}-m1`, name: `114年度成果報告初審會議紀錄.pdf`, size: "1.2 MB" }],
  }
}

const OUTCOME_REPORT_CASES: OutcomeReportCase[] = OUTCOME_REPORT_TYPES.flatMap((t) =>
  allSocieties.map((society, index) => buildCase(society.id, society.name, t.id, index)),
)

export function getOutcomeReportCases(type: OutcomeReportType): OutcomeReportCase[] {
  return OUTCOME_REPORT_CASES.filter((c) => c.type === type)
}

export function getOutcomeReportCase(societyId: string, type: OutcomeReportType): OutcomeReportCase | undefined {
  return OUTCOME_REPORT_CASES.find((c) => c.societyId === societyId && c.type === type)
}

export function getOutcomeReportTypeName(type: OutcomeReportType): string {
  return REPORT_TYPE_LABEL[type]
}

export function getSocietyName(societyId: string): string {
  return allSocieties.find((s) => s.id === societyId)?.name ?? societyId
}

/** 各階段案件數，供列表頁的階段篩選使用。 */
export function getOutcomeReportStageCounts(type: OutcomeReportType) {
  const cases = getOutcomeReportCases(type)
  return (Object.keys(OUTCOME_REPORT_STAGE_CONFIG) as OutcomeReportStage[])
    .map((stage) => ({ stage, count: cases.filter((c) => c.stage === stage).length }))
    .filter((s) => s.count > 0)
}
