export const mockAdditionalQuotaApplications = [
  {
    id: "1",
    hospitalName: "台大醫院",
    year: "115 年度",
    submittedDate: "2025-01-15",
    requestedQuota: 5,
    status: "待審查" as const,
  },
  {
    id: "2",
    hospitalName: "台北榮總",
    year: "115 年度",
    submittedDate: "2025-01-18",
    requestedQuota: 3,
    status: "待審查" as const,
  },
  {
    id: "3",
    hospitalName: "長庚醫院",
    year: "115 年度",
    submittedDate: "2025-01-20",
    requestedQuota: 4,
    status: "待公告" as const,
    reviewedDate: "2025-01-25 14:30",
  },
  {
    id: "4",
    hospitalName: "馬偕醫院",
    year: "115 年度",
    submittedDate: "2025-01-10",
    requestedQuota: 2,
    status: "已公告" as const,
    reviewedDate: "2025-01-22 10:15",
    announcedDate: "2025-01-28",
  },
  {
    id: "5",
    hospitalName: "中國醫藥大學附設醫院",
    year: "115 年度",
    submittedDate: "2025-01-12",
    requestedQuota: 3,
    status: "已公告" as const,
    reviewedDate: "2025-01-23 16:45",
    announcedDate: "2025-01-29",
  },
]

export const additionalQuotaStatusConfig = {
  待審查: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "待審查" },
  待公告: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "待公告" },
  已公告: { color: "bg-green-100 text-green-800 border-green-200", label: "已公告" },
}

export function getAdditionalQuotaApplications() {
  return mockAdditionalQuotaApplications
}

export function getAdditionalQuotaStatusConfig() {
  return additionalQuotaStatusConfig
}

