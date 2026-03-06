export const mockAnnouncements = [
  {
    id: "1",
    title: "115年度專科醫師訓練計畫認定基準修訂公告",
    category: "training",
    subcategory: "selection-criteria",
    publishDate: "2025-03-15",
    publisher: "醫事司",
    isNew: true,
    isPinned: true,
    hasAttachments: true,
    attachmentCount: 2,
    excerpt:
      "依據專科醫師分科及甄審辦法第五條規定，公告115年度各專科醫師訓練計畫認定基準修訂內容...",
  },
  {
    id: "2",
    title: "訓練醫院認定基準更新通知",
    category: "training",
    subcategory: "hospital-criteria",
    publishDate: "2025-03-10",
    publisher: "醫事司",
    isNew: true,
    isPinned: false,
    hasAttachments: true,
    attachmentCount: 1,
    excerpt: "為提升專科醫師訓練品質，更新訓練醫院認定基準相關規範...",
  },
  {
    id: "3",
    title: "114年度外加容額申請審查結果公告",
    category: "additional-quota",
    subcategory: "review-result",
    publishDate: "2025-03-05",
    publisher: "醫事司",
    isNew: false,
    isPinned: true,
    hasAttachments: true,
    attachmentCount: 3,
    excerpt: "公告114年度各醫院申請外加容額審查結果，核定名單詳如附件...",
  },
  {
    id: "4",
    title: "115年度外加容額申請開放公告",
    category: "additional-quota",
    subcategory: "application",
    publishDate: "2025-02-28",
    publisher: "醫事司",
    isNew: false,
    isPinned: false,
    hasAttachments: true,
    attachmentCount: 1,
    excerpt: "115年度外加容額申請即日起開放受理，申請期限至115年4月30日止...",
  },
  {
    id: "5",
    title: "115年度專科醫師甄審原則修訂說明",
    category: "review",
    subcategory: "principles",
    publishDate: "2025-02-20",
    publisher: "醫事司",
    isNew: false,
    isPinned: true,
    hasAttachments: true,
    attachmentCount: 2,
    excerpt: "配合醫療環境變遷，修訂115年度專科醫師甄審原則相關內容...",
  },
  {
    id: "6",
    title: "114年度醫院容額分配審查結果",
    category: "review",
    subcategory: "quota-result",
    publishDate: "2025-02-15",
    publisher: "醫事司",
    isNew: false,
    isPinned: false,
    hasAttachments: true,
    attachmentCount: 4,
    excerpt:
      "公告114年度各醫學會醫院容額分配審查結果，核定名單及容額數詳如附件...",
  },
  {
    id: "7",
    title: "訓練課程基準修正案說明會通知",
    category: "training",
    subcategory: "course-criteria",
    publishDate: "2025-02-10",
    publisher: "醫事司",
    isNew: false,
    isPinned: false,
    hasAttachments: true,
    attachmentCount: 1,
    excerpt:
      "將於115年3月20日舉辦訓練課程基準修正案說明會，歡迎各醫學會代表參加...",
  },
  {
    id: "8",
    title: "公告評核標準更新通知",
    category: "training",
    subcategory: "evaluation-criteria",
    publishDate: "2025-02-05",
    publisher: "醫事司",
    isNew: false,
    isPinned: false,
    hasAttachments: true,
    attachmentCount: 2,
    excerpt:
      "更新專科醫師訓練公告評核標準，新增評核項目與配分調整說明...",
  },
]

export const mockAnnouncementDetails: Record<string, any> = {
  "1": {
    id: "1",
    title: "115年度專科醫師訓練計畫認定基準修訂公告",
    category: "training",
    subcategory: "甄審原則",
    publishDate: "2025-03-15",
    publisher: "醫事司",
    publisherUnit: "醫事司第五科",
    effectiveDate: "2025-04-01",
    content: `
一、公告依據：
依據專科醫師分科及甄審辦法第五條規定，公告115年度各專科醫師訓練計畫認定基準修訂內容。

二、修訂重點：
（一）調整訓練期程規定，明確規範各專科訓練年限及階段要求
（二）新增臨床技能評核機制，強化實務訓練品質管控
（三）增訂跨領域整合訓練課程要求，培養全人照護能力
（四）修正師資資格條件，提升教學品質
（五）調整訓練容額計算方式，確保訓練品質

三、適用對象：
本修訂基準適用於115年度申請專科醫師訓練計畫認定之各專科醫學會。

四、施行日期：
本修訂基準自115年4月1日起施行。

五、相關規定：
各專科醫學會應於收到本公告後30日內，依修訂基準調整訓練計畫內容，並提送本部審查。

六、聯絡窗口：
如有疑問，請洽醫事司第五科，電話：(02)8590-6666分機7100。
    `.trim(),
    attachments: [
      {
        id: "1-1",
        name: "115年度專科醫師訓練計畫認定基準修訂對照表.pdf",
        size: "2.3 MB",
        uploadDate: "2025-03-15",
      },
      {
        id: "1-2",
        name: "專科醫師訓練計畫認定基準修訂說明.docx",
        size: "856 KB",
        uploadDate: "2025-03-15",
      },
    ],
    relatedAnnouncements: [
      { id: "2", title: "訓練醫院認定基準更新通知", date: "2025-03-10" },
      { id: "7", title: "訓練課程基準修正案說明會通知", date: "2025-02-10" },
    ],
  },
  "2": {
    id: "2",
    title: "訓練醫院認定基準更新通知",
    category: "training",
    subcategory: "訓練醫院認定基準",
    publishDate: "2025-03-10",
    publisher: "醫事司",
    publisherUnit: "醫事司第五科",
    effectiveDate: "2025-03-20",
    content: `
一、公告目的：
為提升專科醫師訓練品質，更新訓練醫院認定基準相關規範，以確保訓練環境符合教學需求。

二、更新內容：
（一）提高訓練醫院基本設備要求標準
（二）明訂師資人力配置最低標準
（三）新增年度評鑑機制及退場機制
（四）調整各專科別訓練醫院容額計算方式

三、適用範圍：
本更新基準適用於所有申請成為專科醫師訓練醫院之醫療機構。

四、施行日期：
本更新基準自115年3月20日起施行。

五、辦理方式：
現有訓練醫院應於本公告發布後60日內完成自我評估，並提送改善計畫。

六、聯絡資訊：
承辦人：李小姐，電話：(02)8590-6666分機7105。
    `.trim(),
    attachments: [
      {
        id: "2-1",
        name: "訓練醫院認定基準更新內容.pdf",
        size: "1.8 MB",
        uploadDate: "2025-03-10",
      },
    ],
    relatedAnnouncements: [
      { id: "1", title: "115年度專科醫師訓練計畫認定基準修訂公告", date: "2025-03-15" },
    ],
  },
  "3": {
    id: "3",
    title: "114年度外加容額申請審查結果公告",
    category: "additional-quota",
    subcategory: "審查結果",
    publishDate: "2025-03-05",
    publisher: "醫事司",
    publisherUnit: "醫事司第五科",
    content: `
一、審查說明：
本部已完成114年度各醫院申請外加容額之審查作業，核定結果如附件名單。

二、核定原則：
（一）符合偏遠地區醫療需求者
（二）配合國家重點醫療政策者
（三）訓練品質經評估合格者

三、核定內容：
本次共核定23家醫院，總計外加容額156名，分布於內科、外科、婦產科等15個專科。

四、注意事項：
（一）核定醫院應於收到通知後30日內確認是否接受
（二）外加容額有效期限為3年
（三）訓練品質需持續符合本部規定

五、後續作業：
獲核定醫院將另行收到正式核定函，請依函文辦理後續作業。
    `.trim(),
    attachments: [
      {
        id: "3-1",
        name: "114年度外加容額核定名單.pdf",
        size: "1.2 MB",
        uploadDate: "2025-03-05",
      },
      {
        id: "3-2",
        name: "外加容額分配統計表.xlsx",
        size: "245 KB",
        uploadDate: "2025-03-05",
      },
      {
        id: "3-3",
        name: "審查會議紀錄.pdf",
        size: "3.1 MB",
        uploadDate: "2025-03-05",
      },
    ],
    relatedAnnouncements: [
      { id: "4", title: "115年度外加容額申請開放公告", date: "2025-02-28" },
    ],
  },
}

export function getAnnouncements() {
  return mockAnnouncements
}

export function getAnnouncementDetail(id: string) {
  return mockAnnouncementDetails[id]
}

