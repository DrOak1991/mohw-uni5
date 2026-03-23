export const mockHospitalQuotaSocieties = [
  {
    id: "1",
    name: "台灣內科醫學會",
    year: "115 年度",
    submittedDate: "2025-01-15",
    stage: "pending" as const,
    mohwReviewed: false,
    mohwiReviewed: false,
  },
  {
    id: "2",
    name: "台灣外科醫學會",
    year: "115 年度",
    submittedDate: "2025-01-18",
    stage: "group-review" as const,
    mohwReviewed: true,
    mohwiReviewed: true,
  },
  {
    id: "3",
    name: "台灣小兒科醫學會",
    year: "115 年度",
    submittedDate: "2025-01-20",
    stage: "main-review" as const,
    mohwReviewed: false,
    mohwiReviewed: false,
  },
  {
    id: "4",
    name: "台灣婦產科醫學會",
    year: "115 年度",
    submittedDate: "2025-01-10",
    stage: "upload-pending" as const,
    mohwReviewed: false,
    mohwiReviewed: false,
  },
]

export const hospitalQuotaStageConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "待審查" },
  "group-review": { color: "bg-blue-100 text-blue-800 border-blue-200", label: "分組會議審核" },
  "main-review": { color: "bg-purple-100 text-purple-800 border-purple-200", label: "RRC 大會審核" },
  "upload-pending": { color: "bg-green-100 text-green-800 border-green-200", label: "待公告" },
}

// 詳細的醫院容額資料
export const mockHospitalQuotaDetails: Record<string, {
  society: typeof mockHospitalQuotaSocieties[0];
  hospitals: Array<{
    id: number | string;
    code: string;
    name: string;
    status: string;
    statusColor: string;
    expiry: string;
    extension: string;
    limit: number | null;
    prevQuota: number | null;
    currentQuota: number | null;
    groupId: string | null;
    isSubRow: boolean;
  }>;
  disqualifiedHospitals: Array<{
    id: number;
    code: string;
    name: string;
    reason: string;
  }>;
  reviewComment: string;
  groupReviewData?: {
    meetingDate: string;
    meetingRecord: string;
    decision: string;
  };
}> = {
  "1": {
    society: mockHospitalQuotaSocieties[0],
    hospitals: [
      { id: 1, code: "0401180014", name: "台大醫院", status: "效期屆滿", statusColor: "bg-yellow-100 text-yellow-700", expiry: "有效至 2026/7/31", extension: "4 年 (至 2030/7/31)", limit: 15, prevQuota: 5, currentQuota: 5, groupId: null, isSubRow: false },
      { id: 2, code: "0401180015", name: "榮民總醫院", status: "新申請", statusColor: "bg-blue-100 text-blue-700", expiry: "有效至 2026/7/31", extension: "-", limit: 12, prevQuota: 3, currentQuota: 4, groupId: null, isSubRow: false },
      { id: 3, code: "0401180016", name: "長庚醫院", status: "效期屆滿", statusColor: "bg-yellow-100 text-yellow-700", expiry: "有效至 2024/7/31", extension: "4 年 (至 2028/7/31)", limit: 10, prevQuota: 2, currentQuota: 3, groupId: null, isSubRow: false },
      { id: 4, code: "0401180017", name: "中國醫藥大學附醫", status: "效期屆滿", statusColor: "bg-yellow-100 text-yellow-700", expiry: "有效至 2026/7/31", extension: "4 年 (至 2030/7/31)", limit: 8, prevQuota: 2, currentQuota: 2, groupId: null, isSubRow: false },
      { id: "5.1", code: "0401180018", name: "聯合申請 (仁愛院區)", status: "效期屆滿", statusColor: "bg-yellow-100 text-yellow-700", expiry: "有效至 2026/7/31", extension: "4 年 (至 2030/7/31)", limit: 15, prevQuota: 4, currentQuota: 5, groupId: "group-a", isSubRow: false },
      { id: "5.2", code: "0401180019", name: "聯合申請 (和平院區)", status: "", statusColor: "", expiry: "", extension: "", limit: null, prevQuota: null, currentQuota: null, groupId: "group-a", isSubRow: true },
    ],
    disqualifiedHospitals: [
      { id: 1, code: "0401180020", name: "新光醫院", reason: "未符合訓練醫院認證基準第3條：專任主治醫師人數不足" },
    ],
    reviewComment: "",
  },
  "2": {
    society: mockHospitalQuotaSocieties[1],
    hospitals: [
      { id: 1, code: "0501180014", name: "台大醫院", status: "效期屆滿", statusColor: "bg-yellow-100 text-yellow-700", expiry: "有效至 2026/7/31", extension: "4 年 (至 2030/7/31)", limit: 12, prevQuota: 4, currentQuota: 5, groupId: null, isSubRow: false },
      { id: 2, code: "0501180015", name: "三軍總醫院", status: "效期屆滿", statusColor: "bg-yellow-100 text-yellow-700", expiry: "有效至 2025/7/31", extension: "4 年 (至 2029/7/31)", limit: 10, prevQuota: 3, currentQuota: 3, groupId: null, isSubRow: false },
    ],
    disqualifiedHospitals: [],
    reviewComment: "",
    groupReviewData: {
      meetingDate: "114/02/15",
      meetingRecord: "114年度第一次分組會議記錄.pdf",
      decision: "通過",
    },
  },
  "3": {
    society: mockHospitalQuotaSocieties[2],
    hospitals: [
      { id: 1, code: "0601180014", name: "台大兒童醫院", status: "效期屆滿", statusColor: "bg-yellow-100 text-yellow-700", expiry: "有效至 2026/7/31", extension: "4 年 (至 2030/7/31)", limit: 8, prevQuota: 3, currentQuota: 4, groupId: null, isSubRow: false },
      { id: 2, code: "0601180015", name: "馬偕兒童醫院", status: "新申請", statusColor: "bg-blue-100 text-blue-700", expiry: "有效至 2026/7/31", extension: "-", limit: 6, prevQuota: 2, currentQuota: 2, groupId: null, isSubRow: false },
    ],
    disqualifiedHospitals: [],
    reviewComment: "分組會議建議通過，請提交 RRC 大會審核。",
    groupReviewData: {
      meetingDate: "114/02/20",
      meetingRecord: "114年度第二次分組會議記錄.pdf",
      decision: "通過",
    },
  },
  "4": {
    society: mockHospitalQuotaSocieties[3],
    hospitals: [
      { id: 1, code: "0701180014", name: "台大醫院", status: "效期屆滿", statusColor: "bg-yellow-100 text-yellow-700", expiry: "有效至 2026/7/31", extension: "4 年 (至 2030/7/31)", limit: 10, prevQuota: 3, currentQuota: 4, groupId: null, isSubRow: false },
    ],
    disqualifiedHospitals: [],
    reviewComment: "RRC 大會審核通過，待公告。",
    groupReviewData: {
      meetingDate: "114/02/10",
      meetingRecord: "114年度第一次分組會議記錄.pdf",
      decision: "通過",
    },
  },
}

export function getHospitalQuotaSocieties() {
  return mockHospitalQuotaSocieties
}

export function getHospitalQuotaStageConfig() {
  return hospitalQuotaStageConfig
}

export function getHospitalQuotaDetail(id: string) {
  return mockHospitalQuotaDetails[id] || null
}

