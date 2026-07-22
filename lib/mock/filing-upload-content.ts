// 上傳版型（single-upload / evaluation-upload）的文件內容與修正對照表 mock 來源
// 原型階段以結構化文字模擬 Word/PDF 內容，日後可替換為真實檔案渲染。
// 供填報專區與（未來）審查專區共用。

export interface DocSection {
  heading: string
  body: string
}

// 單一份文件的內容（某文件、某年度）
export interface DocContent {
  // 年度／版本標示，例如「114 年度版本」
  meta: string
  sections: DocSection[]
}

// 修正對照表的單列（本次修訂前後對照）
export interface ComparisonRow {
  item: string
  before: string
  after: string
  note: string
}

export interface ComparisonContent {
  rows: ComparisonRow[]
}

// 邏輯文件鍵：版型 B 只有 main；版型 C 有 standards（評核標準）與 form（評核表）
export type UploadDocKey = "main" | "standards" | "form"
export type DocYear = "previous" | "current"

interface UploadDocEntry {
  label: string
  previous: DocContent
  current: DocContent
  comparison: ComparisonContent
}

// 依「文件標題」產生擬真的結構化內容，維持 DRY 又能區分年度
function buildContent(docLabel: string, year: DocYear): DocContent {
  const yearLabel = year === "previous" ? "113 年度版本" : "114 年度版本"
  const revisionNote =
    year === "previous"
      ? "本版為前一年度公告版本，內容僅供對照參考。"
      : "本版為本年度提報版本，已依審查意見與法規更新調整。"
  return {
    meta: yearLabel,
    sections: [
      {
        heading: "第一章　總則",
        body: `${revisionNote}\n\n一、本${docLabel}依專科醫師訓練相關法規訂定，作為各訓練機構辦理之依循。\n二、本${docLabel}適用於經認定之專科醫師訓練醫院及其合作機構。`,
      },
      {
        heading: "第二章　訓練條件與資格",
        body:
          year === "previous"
            ? "一、訓練醫院應具備合格之指導醫師至少三名。\n二、每一訓練容額應配置對應之臨床訓練設施與病床數。\n三、訓練期間不得少於規定之最低月數。"
            : "一、訓練醫院應具備合格之指導醫師至少四名（本年度由三名調整為四名）。\n二、每一訓練容額應配置對應之臨床訓練設施與病床數，並新增門診訓練時數規範。\n三、訓練期間不得少於規定之最低月數。",
      },
      {
        heading: "第三章　評核與考核",
        body: `一、訓練機構應建立定期評核機制，每年至少辦理二次。\n二、評核結果應納入年度訓練品質檢討。\n三、${docLabel}相關表單應完整保存備查。`,
      },
      {
        heading: "第四章　附則",
        body: `本${docLabel}經衛生福利部公告後施行，修正時亦同。`,
      },
    ],
  }
}

function buildComparison(docLabel: string): ComparisonContent {
  return {
    rows: [
      {
        item: "指導醫師人數",
        before: "至少三名",
        after: "至少四名",
        note: "依審查意見提高師資門檻",
      },
      {
        item: "門診訓練時數",
        before: "未規範",
        after: "新增每週至少四小時",
        note: "本年度新增條文",
      },
      {
        item: "評核頻率",
        before: "每年一次",
        after: "每年二次",
        note: "強化訓練品質追蹤",
      },
      {
        item: `${docLabel}適用範圍`,
        before: "訓練醫院",
        after: "訓練醫院及其合作機構",
        note: "擴大適用對象",
      },
    ],
  }
}

function makeEntry(label: string): UploadDocEntry {
  return {
    label,
    previous: buildContent(label, "previous"),
    current: buildContent(label, "current"),
    comparison: buildComparison(label),
  }
}

// 依文件 id 對應各邏輯文件的內容
// 版型 B：main；版型 C：standards + form
const UPLOAD_CONTENT: Record<string, Partial<Record<UploadDocKey, UploadDocEntry>>> = {
  "training-curriculum": {
    main: makeEntry("訓練課程基準"),
  },
  "screening-principle": {
    main: makeEntry("甄審原則"),
  },
  "evaluation-standards": {
    standards: makeEntry("評核標準"),
    form: makeEntry("評核表"),
  },
}

export function getUploadDocEntry(docId: string, key: UploadDocKey): UploadDocEntry | undefined {
  return UPLOAD_CONTENT[docId]?.[key]
}

// 需補件（needs-revision）狀態的審查意見。
// 實務上主管機關會開審查會議並產出一份會議紀錄，醫學會據該紀錄調整文件，
// 因此以「會議紀錄全文」為主體，不拆解為條文層級的結構化意見。
// 形狀對應 components/filing/review-feedback-banner 的 ReviewFeedback；
// 此處不 import 該型別，避免 lib 反向依賴 components，由呼叫端做結構檢查。
const UPLOAD_REVIEW_FEEDBACK: Record<
  string,
  { reviewDate: string; meetingTitle: string; fullContent: string }
> = {
  "training-curriculum": {
    reviewDate: "114/04/08",
    meetingTitle: "114年度第二次專科醫師訓練課程基準審查會議",
    fullContent: `一、會議時間：114年4月8日（星期二）下午2時

二、會議地點：衛生福利部第二會議室

三、主席：○○○司長
    紀錄：○○○

四、出席人員：（略）

五、審查意見：

（一）關於課程架構部分：
    1. 第二章所列指導醫師人數由三名調整為四名，方向認同，惟未說明既有訓練醫院之過渡期安排。
       請補充新制實施後之緩衝條款，並敘明未達標準之訓練醫院應於多久期限內完成調整。

    2. 新增之門診訓練每週四小時規範，未載明得否併計夜間門診與社區醫療站服務時數。
       請於課程基準中明確定義可採計之訓練場域範圍。

（二）關於課程與評核之對應部分：
    1. 各核心課程與評核標準之對應關係未見說明。建議增列對照表，
       載明每項核心課程對應之評核方式（如：直接觀察、病歷審查、口頭測驗）。

    2. 第三章評核頻率由每年一次提高為二次，惟未說明二次評核之時點與差異。
       請敘明期中與期末評核之目的區隔。

（三）其他建議事項：
    1. 修正對照表之「修訂理由」欄位過於簡略，多處僅填「依審查意見」，
       請具體說明修訂之法規依據或實務考量。
    2. 請確認本基準用語與「訓練計畫認定基準」一致，避免同一概念使用不同名詞。
    3. 請於修正後一個月內重新送審。

六、散會：下午4時20分`,
  },
  "screening-principle": {
    reviewDate: "114/03/06",
    meetingTitle: "114年度專科醫師甄審原則審查會議",
    fullContent: `一、會議時間：114年3月6日（星期四）上午9時30分

二、會議地點：衛生福利部第一會議室

三、主席：○○○副司長
    紀錄：○○○

四、出席人員：（略）

五、審查意見：

（一）關於甄審資格部分：
    1. 訓練年資之採計方式未涵蓋中斷訓練後復訓之情形。
       請補充因育嬰、兵役、傷病等事由中斷訓練者，其年資採計與銜接規定。

    2. 國外訓練資歷之認定標準未見說明，請敘明採認原則及應檢附之證明文件。

（二）關於甄審方式部分：
    1. 筆試與口試之配分比重未於本原則載明，僅稱「依當年度公告」，
       建議至少訂定比重範圍，以利應試者預為準備。

    2. 口試評分項目及評分者人數未規範，請補充以確保評分之一致性。

（三）其他建議事項：
    1. 適用範圍由「訓練醫院」擴大為「訓練醫院及其合作機構」，
       請確認合作機構之定義與「訓練計畫認定基準」所稱者一致。
    2. 請於修正後一個月內重新送審。

六、散會：上午11時40分`,
  },
  "evaluation-standards": {
    reviewDate: "114/04/02",
    meetingTitle: "114年度專科醫師評核標準與評核表審查會議",
    fullContent: `一、會議時間：114年4月2日（星期三）下午2時

二、會議地點：衛生福利部第三會議室

三、主席：○○○司長
    紀錄：○○○

四、出席人員：（略）

五、審查意見：

（一）關於評核標準部分：
    1. 評核項目雖已分列，惟各項目之評分尺規（rubric）未具體化，
       多以「優、良、可、待加強」四級表示而未定義各級之行為描述。
       請補充各等級之判準，以降低評核者間之主觀落差。

    2. 評核頻率調整為每年二次，請說明二次評核結果之權重與綜合判定方式。

（二）關於評核表部分：
    1. 評核表欄位與評核標準所列項目未完全對應，部分標準項目於表中無對應欄位。
       請逐項檢視並補齊，確保標準與表單一致。

    2. 評核表未設「受評者回饋」欄位。建議增列，使受訓醫師得就評核結果表示意見，
       落實雙向回饋機制。

    3. 評核表之保存年限與調閱權限未見規範，請補充。

（三）其他建議事項：
    1. 評核標準與評核表二份文件之修正對照表，其修訂理由多有重複，
       請就各別文件之修訂脈絡分別敘明。
    2. 請於修正後一個月內重新送審。

六、散會：下午4時50分`,
  },
}

export function getUploadReviewFeedback(docId: string) {
  return UPLOAD_REVIEW_FEEDBACK[docId]
}
