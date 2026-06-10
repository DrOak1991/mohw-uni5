/**
 * 容額填報備註的 module-level store（mock 用途）
 * 因為是 singleton，整個 session 期間資料會保留；頁面間導航不會丟失。
 *
 * key = hospital id (string)，value = 備註內容
 * 對應 review-hospital-quota.ts 中的 mockHospitalQuotaDetails
 */
export const quotaNotesStore = {
  hospitalNotes: {
    // ── 內科醫學會（detail id "1"）的醫院備註 ──────────────────────
    "1": "台大醫院本年度申請新增林口長庚聯合認定組合為合作醫院，實際容額上限請依最新核定公文為準。",
    "4": "中國醫藥大學附設醫院主訓醫師異動（原主任退休），已補件說明，請審查時參照補充說明文件。",
    "7.1": "林口長庚聯合認定組合：本次新增中山醫學大學附設醫院為合作機構，合作協議書已於 114/12/01 完成簽署。",

    // ── 外科醫學會（detail id "2"）的醫院備註 ──────────────────────
    // 外科使用不同 id 系列（1–8），與內科無衝突
    // 備註掛在 hospital.id 字串上，外科 detail 中的 hospital.id 為 1–8
  } as Record<string, string>,
}
