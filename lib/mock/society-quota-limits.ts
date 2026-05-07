import { allSocieties } from "@/lib/data/societies"

export interface SocietyQuotaLimit {
  societyId: string
  societyName: string
  totalLimit: number | null
  previousLimit: number | null
  updatedAt: string | null
  updatedBy: string | null
}

export const societyQuotaLimits: SocietyQuotaLimit[] = allSocieties.map((society, index) => {
  // 為演示目的，根據索引生成不同的容額上限
  const baseLimit = 50 + index * 5
  const hasValue = index % 4 !== 0 // 25% 的醫學會尚未設定
  
  return {
    societyId: society.id,
    societyName: society.name,
    totalLimit: hasValue ? baseLimit : null,
    previousLimit: baseLimit - 5,
    updatedAt: hasValue ? "2025/03/15" : null,
    updatedBy: hasValue ? "林承恩" : null,
  }
})
