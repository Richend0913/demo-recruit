/**
 * デモLPの掲載内容（コスモ軽貨物・架空）。
 * 条件・FAQ・数字はすべてサンプル。文言はコンポーネントから分離し、ここを正とする。
 */

export interface TermRow {
  label: string;
  /** 先頭の強調部分（任意）。本文の事実は変えない。 */
  strong?: string;
  body: string;
}

export const terms: TermRow[] = [
  { label: '雇用形態', strong: '業務委託', body: '（雇用ではありません。社会保険・雇用保険・有給はありません）' },
  { label: '報酬体系', body: '完全出来高（1配達 150円〜／エリア・案件で変動・サンプル）。締め翌月末払い' },
  { label: 'あなたの負担（経費）', body: '車両リース 月40,000円／ガソリン／任意保険・貨物保険 月18,000円／業務委託手数料 売上の10%' },
  { label: '契約期間・違約金', body: '1年更新。中途解約の違約金なし（リース車は返却）' },
  { label: '必要なもの', body: '普通自動車免許（AT可）。黒ナンバー登録はこちらで案内・サポート' },
  { label: '未経験', body: '可。先輩ドライバーの同乗研修3〜5日あり' },
  { label: '稼働エリア', body: '東京都・神奈川県（架空）。希望を伺います' },
  { label: '契約時', body: '業務内容・報酬・支払期日を書面（電磁的方法）で明示します（フリーランス新法対応）' },
];

export interface AppealPoint {
  title: string;
  body: string;
}

export const appealPoints: AppealPoint[] = [
  {
    title: '手取りまで正直に開示',
    body: '売上だけでなく、リース・ガソリン・保険・手数料まで引いた「残る金額」をシミュレータで先に確認できます。入ってから「思っていたのと違う」をなくすための開示です。',
  },
  {
    title: '未経験から始められる',
    body: '必要なのは普通自動車免許（AT可）だけ。最初の3〜5日は先輩ドライバーが同乗し、積み方・配達の流れ・アプリの使い方を一緒に覚えます。',
  },
  {
    title: '自分のペースで働ける',
    body: '週2日〜の稼働も相談OK。休憩は自分のペースで取れ、掛け持ち・副業も可能です。1人で黙々と配達したい方に向いています。',
  },
  {
    title: '違約金なし・書面で明示',
    body: '契約は1年更新で、中途解約の違約金はありません（リース車は返却）。業務内容・報酬・支払期日は契約時に書面（電磁的方法）で明示します。',
  },
];

export interface DayStep {
  time: string;
  title: string;
  body: string;
}

export const daySteps: DayStep[] = [
  { time: '朝 8:00', title: 'センター集荷', body: 'その日の荷物を積み込み、配送ルートを確認。' },
  { time: '午前〜午後', title: '配達', body: '担当エリアを配達。休憩は自分のペースで。' },
  { time: '夕方', title: '追加便（任意）', body: '余力があればスポット便で上乗せも可能。' },
  { time: '終業', title: '実績報告', body: 'アプリで件数を報告して終了。' },
];

export interface FlowStep {
  title: string;
  body: string;
}

export const flowSteps: FlowStep[] = [
  {
    title: '応募する',
    body: 'このページのフォーム・お電話・右下のAI応募受付から、いつでも応募できます。「話を聞くだけ」でもOKです。',
  },
  {
    title: '担当者からご連絡',
    body: '24時間以内に担当者からご連絡します（デモ）。AIが合否を決めることはありません。',
  },
  {
    title: '面談',
    body: '条件・単価表・経費を書面で明示してお話しします。合わないと感じたら、その場で断っていただいて構いません。',
  },
  {
    title: '同乗研修 → 稼働開始',
    body: '先輩ドライバーの同乗研修（3〜5日）を経て稼働開始。応募から最短3日（サンプル）です。',
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const faqItems: FaqItem[] = [
  {
    q: '本当に未経験でも大丈夫ですか？',
    a: 'はい。普通免許があれば応募できます。最初の3〜5日は先輩が同乗して、積み方・配達の流れ・アプリの使い方をお教えします。',
  },
  {
    q: '収入は保証されますか？',
    a: 'いいえ。完全出来高のため保証はありません。上のシミュレータで、経費を引いた後の手取りの目安をご確認ください（実額は稼働状況で上下します）。',
  },
  {
    q: '外国籍でも応募できますか？',
    a: '応募いただけます。在留資格や就労可否は、会社が面談時に確認します（応募の段階で判定はしません）。',
  },
  {
    q: '掛け持ち・副業は可能ですか？',
    a: '業務委託ですので、稼働日数はご相談のうえ決めます。週2日〜の稼働も可能です。',
  },
];

/**
 * 「応募の実物」シーン用のサンプルデータ。
 * 1人の応募者（K.Tさん）が、求人を見る→応募する→会社に通知が届く→
 * 応募者一覧・CSVに載る、までを一貫した時刻・属性で描くためのもの。
 * すべて架空のサンプル。条件は terms / simSpec と矛盾させない。
 */
export const sceneApplicant = {
  name: 'K.T',
  age: '30代',
  area: '神奈川県',
  contact: '090-****-1234',
  desired: '週4日',
  experience: '未経験',
  message: '未経験ですが、週4日ほど稼働したいです。希望エリアは神奈川です。',
  appliedAt: '2026年11月2日（月）21:47',
} as const;

export interface SceneListRow {
  datetime: string;
  name: string;
  profile: string;
  wish: string;
  status: string;
  isNew?: boolean;
}

export const sceneListRows: SceneListRow[] = [
  {
    datetime: '2026-11-02 21:47',
    name: 'K.T',
    profile: '30代・神奈川県',
    wish: '週4日・未経験',
    status: '未対応',
    isNew: true,
  },
  {
    datetime: '2026-11-01 18:03',
    name: 'M.S',
    profile: '40代・東京都',
    wish: '週5日・宅配経験2年',
    status: '連絡済み',
  },
  {
    datetime: '2026-10-31 12:26',
    name: 'A.Y',
    profile: '20代・神奈川県',
    wish: '週3日・未経験',
    status: '面談調整中',
  },
];

/** 応募者一覧から書き出される CSV の中身（上記一覧と一致させる） */
export const sceneCsvLines: string[] = [
  '応募日時,氏名,年代,居住エリア,連絡先,経験,希望稼働,ひとこと,対応状況',
  '2026-11-02 21:47,K.T,30代,神奈川県,090-****-1234,未経験,週4日,未経験ですが週4日ほど稼働したいです,未対応',
  '2026-11-01 18:03,M.S,40代,東京都,080-****-5678,宅配経験2年,週5日,平日のみ希望です,連絡済み',
  '2026-10-31 12:26,A.Y,20代,神奈川県,070-****-9012,未経験,週3日,話を聞いてから決めたいです,面談調整中',
];

/** シミュレータの計算仕様（現デモから踏襲・決定的） */
export const simSpec = {
  unitPrice: 150, // 1件あたり単価（円・サンプル）
  lease: 40000, // 車両リース（月）
  gasPerDay: 700, // ガソリン（稼働日あたり）
  insurance: 18000, // 任意保険・貨物保険（月）
  feeRate: 0.1, // 業務委託手数料（売上の10%）
  days: { min: 10, max: 26, value: 22 },
  drops: { min: 60, max: 180, step: 10, value: 120 },
} as const;

export const recruitLpUrl =
  'https://richend0913.github.io/burning-recruit-lp/?utm_source=demo&utm_medium=referral&utm_campaign=demo-recruit';
