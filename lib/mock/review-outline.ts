export interface OutlineItem {
  id: string
  number: string
  title: string
  description: string
  children?: OutlineItem[]
}

export interface VersionRecord {
  version: string
  date: string
  operator: string
  isCurrent?: boolean
}

export interface TemplateRecord {
  year: string
  label: string
}

export const outlineMeta: Record<string, { name: string }> = {
  "screening-principle": { name: "甄審原則" },
  "hospital-accreditation": { name: "訓練醫院認定基準" },
  "training-curriculum": { name: "訓練課程基準" },
  "evaluation-standards": { name: "評核標準與評核表" },
  "quota-allocation": { name: "容額分配原則" },
}

export function getInitialOutline(): OutlineItem[] {
  return [
    {
      id: "1",
      number: "1",
      title: "基本資訊",
      description: "包含專科名稱、訓練年限等基本設定",
      children: [
        {
          id: "1-1",
          number: "1.1",
          title: "專科名稱",
          description: "請填明確標示專科全名",
        },
        {
          id: "1-2",
          number: "1.2",
          title: "訓練年限",
          description: "請填明完整訓練年限(年/月)",
        },
        {
          id: "1-3",
          number: "1.3",
          title: "法規依據",
          description: "相關法規與辦法引用",
        },
      ],
    },
    {
      id: "2",
      number: "2",
      title: "訓練目標",
      description: "明確說明訓練計畫之整體目標",
      children: [
        {
          id: "2-1",
          number: "2.1",
          title: "核心能力",
          description: "請列舉至少五項核心能力",
        },
      ],
    },
    {
      id: "3",
      number: "3",
      title: "訓練內容",
      description: "詳細列出訓練內容與課程規劃",
      children: [],
    },
    {
      id: "4",
      number: "4",
      title: "評估方式",
      description: "說明訓練成效的評估標準與方法",
      children: [],
    },
  ]
}

export const mockVersions: VersionRecord[] = [
  { version: "當前版本", date: "", operator: "王小明", isCurrent: true },
  { version: "v2.1", date: "2024/10/01", operator: "陳大華" },
  { version: "v2.0", date: "2024/08/15", operator: "林美玲" },
  { version: "v1.0", date: "2024/01/10", operator: "張志豪" },
]

export const mockTemplates: TemplateRecord[] = [
  { year: "2024", label: "甄審原則" },
  { year: "2023", label: "甄審原則" },
  { year: "2022", label: "甄審原則" },
  { year: "2021", label: "甄審原則" },
  { year: "2020", label: "甄審原則" },
]

