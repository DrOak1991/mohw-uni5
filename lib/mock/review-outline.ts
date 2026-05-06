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

export interface FilingItemConfig {
  id: string
  name: string
  status: "open" | "closed" | "scheduled"
  openingDate?: string
  closingDate?: string
  isScheduled: boolean
  isManualControl: boolean
}

export const outlineMeta: Record<string, { name: string }> = {
  "training-plan": { name: "訓練計畫認定基準" },
  "training-curriculum": { name: "訓練課程基準" },
  "evaluation-standards": { name: "評核標準與評核表" },
  "quota-allocation": { name: "容額分配原則" },
  "improvement-guide": { name: "精進指南" },
  "screening-principle": { name: "甄審原則" },
}

export const filingItemsConfig: FilingItemConfig[] = [
  {
    id: "training-plan",
    name: "訓練計畫認定基準",
    status: "open",
    openingDate: "2026/03/01 09:00",
    closingDate: "2026/03/31 17:00",
    isScheduled: true,
    isManualControl: false,
  },
  {
    id: "training-curriculum",
    name: "訓練課程基準",
    status: "open",
    openingDate: "2026/03/01 09:00",
    closingDate: "2026/04/30 17:00",
    isScheduled: true,
    isManualControl: false,
  },
  {
    id: "evaluation-standards",
    name: "評核標準與評核表",
    status: "open",
    openingDate: "2026/03/01 09:00",
    closingDate: "2026/04/30 17:00",
    isScheduled: true,
    isManualControl: false,
  },
  {
    id: "quota-allocation",
    name: "容額分配原則",
    status: "open",
    openingDate: "2026/03/15 09:00",
    closingDate: "2026/04/15 17:00",
    isScheduled: true,
    isManualControl: false,
  },
  {
    id: "improvement-guide",
    name: "精進指南",
    status: "closed",
    openingDate: "",
    closingDate: "",
    isScheduled: false,
    isManualControl: true,
  },
  {
    id: "screening-principle",
    name: "甄審原則",
    status: "open",
    openingDate: "2026/03/01 09:00",
    closingDate: "2026/03/31 17:00",
    isScheduled: true,
    isManualControl: false,
  },
]

export const quotaFilingConfig: FilingItemConfig = {
  id: "hospital-quota",
  name: "容額填報",
  status: "open",
  openingDate: "2026/03/01 09:00",
  closingDate: "2026/05/31 17:00",
  isScheduled: true,
  isManualControl: false,
}

export function getInitialOutline(): OutlineItem[] {
  return [
    {
      id: "1",
      number: "1",
      title: "甄審原則",
      description: "規定醫師參加專科醫師甄審之基本原則",
    },
    {
      id: "2",
      number: "2",
      title: "醫師資格",
      description: "明確列舉符合甄審資格之醫師條件",
    },
    {
      id: "3",
      number: "3",
      title: "訓練醫院資格",
      description: "規定訓練醫院應符合之認定基準",
    },
    {
      id: "4",
      number: "4",
      title: "訓練計畫執行架構",
      description: "說明訓練計畫之執行方式與組織架構",
    },
    {
      id: "5",
      number: "5",
      title: "甄審程序",
      description: "詳細說明甄審之報名、初審、複審等程序",
    },
    {
      id: "6",
      number: "6",
      title: "甄審結果",
      description: "規定甄審結果之公告與異議處理方式",
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

