// 統一的醫學會清單資料
export interface Society {
  id: string
  name: string
  specialty: string
}

// 完整的 25 間醫學會清單
export const allSocieties: Society[] = [
  { id: "1", name: "台灣家庭醫學醫學會", specialty: "家庭醫學科" },
  { id: "2", name: "台灣內科醫學會", specialty: "內科" },
  { id: "3", name: "台灣外科醫學會", specialty: "外科" },
  { id: "4", name: "臺灣兒科醫學會", specialty: "兒科" },
  { id: "5", name: "台灣婦產科醫學會", specialty: "婦產科" },
  { id: "6", name: "中華民國骨科醫學會", specialty: "骨科" },
  { id: "7", name: "社團法人台灣神經外科醫學會", specialty: "神經外科" },
  { id: "8", name: "台灣泌尿科醫學會", specialty: "泌尿科" },
  { id: "9", name: "台灣耳鼻喉頭頸外科醫學會", specialty: "耳鼻喉頭頸外科" },
  { id: "10", name: "中華民國眼科醫學會", specialty: "眼科" },
  { id: "11", name: "社團法人臺灣皮膚科醫學會", specialty: "皮膚科" },
  { id: "12", name: "台灣神經學學會", specialty: "神經科" },
  { id: "13", name: "台灣精神醫學會", specialty: "精神科" },
  { id: "14", name: "台灣復健醫學會", specialty: "復健科" },
  { id: "15", name: "台灣麻醉醫學會", specialty: "麻醉科" },
  { id: "16", name: "社團法人中華民國放射線醫學會", specialty: "放射診斷科" },
  { id: "17", name: "台灣放射腫瘤學會", specialty: "放射腫瘤科" },
  { id: "18", name: "台灣病理學會", specialty: "解剖病理科" },
  { id: "19", name: "台灣臨床病理暨檢驗醫學會", specialty: "臨床病理科" },
  { id: "20", name: "中華民國核醫學學會", specialty: "核子醫學科" },
  { id: "21", name: "社團法人台灣急診醫學會", specialty: "急診醫學科" },
  { id: "22", name: "中華民國環境職業醫學會", specialty: "職業醫學科" },
  { id: "23", name: "台灣整形外科醫學會", specialty: "整形外科" },
  { id: "24", name: "重症醫學專科醫師聯合訓練及甄審籌備委員會", specialty: "重症醫學科" },
  { id: "25", name: "台灣感染症醫學會", specialty: "感染科" },
]

// 以 ID 為 key 的查詢函數
export function getSocietyById(id: string): Society | undefined {
  return allSocieties.find((s) => s.id === id)
}

// 取得所有醫學會
export function getAllSocieties(): Society[] {
  return allSocieties
}
