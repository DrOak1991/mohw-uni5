/**
 * 容額填報備註的 module-level store（mock 用途）
 * 因為是 singleton，整個 session 期間資料會保留；頁面間導航不會丟失。
 */
export const quotaNotesStore = {
  /** key = hospital id (string)，value = 備註內容 */
  hospitalNotes: {} as Record<string, string>,
}
