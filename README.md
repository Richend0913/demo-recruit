# demo-recruit（採用LP制作デモ）

架空の軽貨物会社「コスモ軽貨物」のドライバー募集LP。株式会社MIMORIA の **MIMORIA RECRUIT** が制作する採用LPの見本（デモ）です。

- 公開URL: https://richend0913.github.io/demo-recruit/
- 会社・条件・数字はすべてサンプル（架空）。応募フォームはデモ仕様で、送信しても実送信されません。
- 旧デモ（demo-recruit.pages.dev / Cloudflare直接アップロード）から 2026-11-02 に GitHub 管理へ移行。旧デモの保全スナップショットは `~/workspace/projects/demo-recruit-snapshot/`。

## 技術構成

- **Astro 5 + TypeScript**（静的出力）。ソースは `src/`（layouts / components / data / scripts / styles）に分割。
- 掲載内容（条件・FAQ・シミュレータ仕様など）は `src/data/content.ts` を正とする。
- 日本語の改行制御: BudouX（`budoux`）で見出し・リード・本文を文節分割し、文節の途中では折り返さない。
- AI応募受付ウィジェットは `public/widget.js`（現デモから踏襲、そのまま配信）。

## ビルドと公開

```bash
npm install
npm run build   # docs/ に出力
```

GitHub Pages の公開元は `master` ブランチの `/docs`。`docs/` へのビルド成果物をコミットすると公開に反映される。
