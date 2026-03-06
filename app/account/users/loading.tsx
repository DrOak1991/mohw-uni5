import { PageLoading } from "@/components/common/page-state"

export default function Loading() {
  return (
    <PageLoading
      title="載入使用者列表"
      description="正在載入帳號與權限資料，請稍候…"
    />
  )
}
