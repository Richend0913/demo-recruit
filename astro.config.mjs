// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages（プロジェクトサイト）で配信する。
// ソースは src/、ビルド成果物は docs/ に出力し、Pages の公開元を /docs に向ける。
export default defineConfig({
  site: 'https://richend0913.github.io',
  base: '/demo-recruit',
  outDir: './docs',
  build: { format: 'directory' },
});
