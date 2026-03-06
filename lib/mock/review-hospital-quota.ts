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
  "main-review": { color: "bg紫-100 text-purple-800 border-purple-200", label: "RRC 大會審核" },
  "upload-pending": { color: "bg-green-100 text-green-800 border-green-200", label: "待公告" },
}

export function getHospitalQuotaSocieties() {
  return mockHospitalQuotaSocieties
}

export function getHospitalQuotaStageConfig() {
  return hospitalQuotaStageConfig
}

