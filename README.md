# demo-recruit（採用LP制作デモ）

架空の軽貨物会社「コスモ軽貨物」のドライバー募集LP。株式会社MIMORIA の **MIMORIA RECRUIT** が制作する採用LPの見本（デモ）です。

- 公開URL: https://richend0913.github.io/demo-recruit/
- 会社・条件・数字はすべてサンプル（架空）。応募フォームはデモ仕様で、送信しても実送信されません。
- 旧デモ（demo-recruit.pages.dev / Cloudflare直接アップロード）から 2026-11-02 に GitHub 管理へ移行。旧デモの保全スナップショットは `~/workspace/projects/demo-recruit-snapshot/`。

## 技術構成

- **Astro 5 + TypeScript**（静的出力）。ソースは `src/`（layouts / components / data / scripts / styles）に分割。
- 掲載内容（条件・FAQ・シミュレータ仕様など）は `src/data/content.ts` を正とする。
- 日本語の改行制御: BudouX（`budoux`）で見出し・リード・本文を文節分割し、文節の途中では折り返さない（長い文は「／」でも先行分割し、チャンク内部での文中割れを防ぐ）。
- AI応募受付ウィジェットは `public/widget.js`（現デモから踏襲、そのまま配信）。

## デザイン

設計ブリーフ（`~/workspace/goals/mimoria-burning-bros-github/hidden_files/design-brief.md`）準拠で 2026-11-02 に再構築:

- 視覚の主役は「応募の実物」シーン（`Scene.astro`）: スマホで見る求人→応募送信→会社への通知→応募者一覧・CSV を、1人の応募者（K.Tさん・2026-11-02 21:47応募）の一貫したサンプルデータで DOM 構築。
- タイポグラフィは離散ステップのトークン（`clamp()` 不使用）、本文 #323232 / 行間 1.75、余白は 4px 倍数、コンテナ 1120px。
- アクセントはアンバー1色、面の分離は階調とヘアラインのみ、ドロップシャドウなし。モーションはボタンの色遷移（160ms ease-out）のみ。
- 改行QA: Playwright で 390px / 1280px のスクリーンショットを目視し、文節境界以外で割れていないことを確認してから公開する。

## ビルドと公開

```bash
npm install
npm run build   # docs/ に出力
```

GitHub Pages の公開元は `master` ブランチの `/docs`。`docs/` へのビルド成果物をコミットすると公開に反映される。
