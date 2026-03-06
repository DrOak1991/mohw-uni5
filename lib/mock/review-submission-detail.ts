export const documentTypeInfo: Record<string, { name: string }> = {
  "screening-principle": { name: "甄審原則" },
  "hospital-accreditation": { name: "訓練醫院認定基準" },
  "training-curriculum": { name: "訓練課程基準" },
  "evaluation-standards": { name: "公告評核標準" },
  "quota-allocation": { name: "留存容額分配原則" },
}

export const detailSocieties = [
  { id: "1", name: "台灣內科醫學會" },
  { id: "2", name: "台灣外科醫學會" },
  { id: "3", name: "台灣小兒科醫學會" },
  { id: "4", name: "台灣婦產科醫學會" },
  { id: "5", name: "台灣眼科醫學會" },
  { id: "6", name: "台灣耳鼻喉科醫學會" },
  { id: "7", name: "台灣骨科醫學會" },
  { id: "8", name: "台灣泌尿科醫學會" },
  { id: "9", name: "台灣皮膚科醫學會" },
  { id: "10", name: "台灣神經科醫學會" },
  { id: "11", name: "台灣精神科醫學會" },
  { id: "12", name: "台灣復健科醫學會" },
  { id: "13", name: "台灣麻醉科醫學會" },
  { id: "14", name: "台灣放射線科醫學會" },
  { id: "15", name: "台灣病理科醫學會" },
  { id: "16", name: "台灣核子醫學科醫學會" },
  { id: "17", name: "台灣急診醫學科醫學會" },
  { id: "18", name: "台灣家庭醫學科醫學會" },
  { id: "19", name: "台灣職業醫學科醫學會" },
  { id: "20", name: "台灣整形外科醫學會" },
  { id: "21", name: "台灣神經外科醫學會" },
  { id: "22", name: "台灣胸腔外科醫學會" },
  { id: "23", name: "台灣心臟血管外科醫學會" },
]

export const mockContent = {
  current: `第一章 總則

第一條 目的
本原則依據專科醫師訓練計畫認定辦法第三條規定訂定之。

第二條 適用範圍
本原則適用於內科專科醫師訓練計畫之甄審作業。

第三條 甄審委員會
甄審委員會由本學會理事長擔任召集人，委員包括：
一、本學會理事五人
二、外部專家學者三人
三、衛生福利部代表一人

第四條 甄審標準
申請訓練計畫之醫院應符合下列條件：
一、通過醫院評鑑合格
二、具備完整之內科次專科訓練環境
三、有足夠之專任主治醫師擔任教學工作
四、年度住院醫師訓練容額符合規定`,
  previous: `第一章 總則

第一條 目的
本原則依據專科醫師訓練計畫認定辦法第三條規定訂定之。

第二條 適用範圍
本原則適用於內科專科醫師訓練計畫之甄審作業。

第三條 甄審委員會
甄審委員會由本學會理事長擔任召集人，委員包括：
一、本學會理事三人
二、外部專家學者二人

第四條 甄審標準
申請訓練計畫之醫院應符合下列條件：
一、通過醫院評鑑合格
二、具備完整之內科次專科訓練環境
三、有足夠之專任主治醫師擔任教學工作`,
}

export function getDocumentTypeInfo(id: string) {
  return documentTypeInfo[id]
}

export function getSocietyById(id: string) {
  return detailSocieties.find((s) => s.id === id)
}

