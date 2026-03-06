export const documentTypes = [
  { id: "hospital-accreditation", name: "專科醫師訓練計畫認定基準", shortName: "計畫認定基準" },
  { id: "training-curriculum", name: "訓練課程基準", shortName: "訓練課程基準" },
  { id: "evaluation-standards", name: "評核標準與評核表", shortName: "評核標準" },
  { id: "quota-allocation", name: "留存容額分配原則", shortName: "容額分配原則" },
  { id: "improvement-guide", name: "精進指南", shortName: "精進指南" },
  { id: "screening-principle", name: "甄審原則", shortName: "甄審原則" },
]

export const stagesByDocumentType: Record<string, Array<{ value: string; label: string }>> = {
  "screening-principle": [
    { value: "pending-review", label: "待審查" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
  "hospital-accreditation": [
    { value: "pending-review", label: "待審查" },
    { value: "group-meeting", label: "分組會議審核" },
    { value: "rrc-meeting", label: "RRC 大會審核" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
  "training-curriculum": [
    { value: "pending-review", label: "待審查" },
    { value: "group-meeting", label: "分組會議審核" },
    { value: "rrc-meeting", label: "RRC 大會審核" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
  "evaluation-standards": [
    { value: "pending-review", label: "待審查" },
    { value: "group-meeting", label: "分組會議審核" },
    { value: "rrc-meeting", label: "RRC 大會審核" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
  "quota-allocation": [
    { value: "pending-review", label: "待審查" },
    { value: "group-meeting", label: "分組會議審核" },
    { value: "rrc-meeting", label: "RRC 大會審核" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
  "improvement-guide": [
    { value: "pending-review", label: "待審查" },
    { value: "pending-announcement", label: "待公告" },
    { value: "announced", label: "已公告" },
  ],
}

export const mockSocieties = [
  { id: "1", name: "台灣內科醫學會" },
  { id: "2", name: "台灣外科醫學會" },
  { id: "3", name: "台灣小兒科醫學會" },
  { id: "4", name: "台灣婦產科醫學會" },
  { id: "5", name: "台灣骨科醫學會" },
  { id: "6", name: "台灣眼科醫學會" },
  { id: "7", name: "台灣耳鼻喉科醫學會" },
  { id: "8", name: "台灣皮膚科醫學會" },
  { id: "9", name: "台灣泌尿科醫學會" },
  { id: "10", name: "台灣神經科醫學會" },
  { id: "11", name: "台灣精神醫學會" },
  { id: "12", name: "台灣復健醫學會" },
  { id: "13", name: "台灣麻醉醫學會" },
  { id: "14", name: "台灣急診醫學會" },
  { id: "15", name: "台灣家庭醫學會" },
  { id: "16", name: "台灣病理學會" },
  { id: "17", name: "台灣放射線醫學會" },
  { id: "18", name: "台灣核醫學會" },
  { id: "19", name: "台灣整形外科醫學會" },
  { id: "20", name: "台灣職業醫學會" },
  { id: "21", name: "台灣老年醫學會" },
  { id: "22", name: "台灣安寧緩和醫學會" },
  { id: "23", name: "台灣重症醫學會" },
]

const generateMockSubmissionsByStage = (stages: string[]) => {
  return mockSocieties.map((society, index) => {
    const stageIndex = index % (stages.length + 1)

    if (index % 5 === 0) {
      return {
        societyId: society.id,
        stage: "pending-review",
        uploaded: false,
        uploadedDate: null as string | null,
        lastUpdated: null as string | null,
      }
    }

    return {
      societyId: society.id,
      stage: stages[stageIndex % stages.length],
      uploaded: true,
      uploadedDate: `2025-01-${String(5 + index).padStart(2, "0")}`,
      lastUpdated: `2025-01-${String(10 + index).padStart(2, "0")}`,
    }
  })
}

export const mockDocumentSubmissions: Record<
  string,
  Array<{
    societyId: string
    stage: string
    uploaded: boolean
    uploadedDate: string | null
    lastUpdated: string | null
  }>
> = {
  "screening-principle": generateMockSubmissionsByStage(["pending-review", "pending-announcement", "announced"]),
  "hospital-accreditation": generateMockSubmissionsByStage([
    "pending-review",
    "group-meeting",
    "rrc-meeting",
    "pending-announcement",
    "announced",
  ]),
  "training-curriculum": generateMockSubmissionsByStage([
    "pending-review",
    "group-meeting",
    "rrc-meeting",
    "pending-announcement",
    "announced",
  ]),
  "evaluation-standards": generateMockSubmissionsByStage([
    "pending-review",
    "group-meeting",
    "rrc-meeting",
    "pending-announcement",
    "announced",
  ]),
  "quota-allocation": generateMockSubmissionsByStage([
    "pending-review",
    "group-meeting",
    "rrc-meeting",
    "pending-announcement",
    "announced",
  ]),
  "improvement-guide": generateMockSubmissionsByStage(["pending-review", "pending-announcement", "announced"]),
}

export const stageColors: Record<string, string> = {
  "pending-review": "bg-blue-100 text-blue-800 border-blue-200",
  "group-meeting": "bg-purple-100 text-purple-800 border-purple-200",
  "rrc-meeting": "bg-pink-100 text-pink-800 border-pink-200",
  "pending-announcement": "bg-amber-100 text-amber-800 border-amber-200",
  announced: "bg-green-100 text-green-800 border-green-200",
}

export function getDocumentTypes() {
  return documentTypes
}

export function getStagesForDocumentType(documentTypeId: string) {
  return stagesByDocumentType[documentTypeId] ?? []
}

export function getDocumentSubmissions(documentTypeId: string) {
  return mockDocumentSubmissions[documentTypeId] ?? []
}

export function getSocieties() {
  return mockSocieties
}

export function getStageColors() {
  return stageColors
}

