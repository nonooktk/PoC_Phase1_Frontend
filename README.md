# Tech0 Search — Frontend (Phase 1 PoC)

PROJECT ZERO (テクゼロン社 社内検索エンジン) Phase 1 PoC のフロントエンド。
Next.js 14 (App Router) + TypeScript + Tailwind CSS。

Azure Static Web Apps へのデプロイ用に、モノレポ
([PoC_Phase1](https://github.com/nonooktk/PoC_Phase1)) から `frontend/` だけを
独立リポジトリとして切り出したもの。

## ローカル起動

```bash
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL を埋める
npm run dev                        # → http://localhost:3000
```

バックエンド (FastAPI) は別途 [PoC_Phase1](https://github.com/nonooktk/PoC_Phase1)
の `backend/` を起動する必要あり (デフォルト http://localhost:8000)。

## Azure Static Web Apps へのデプロイ

リリース手順書 §1「UI デプロイ (Next.js → Azure SWA)」に準拠。要点:

- **アプリの場所**: `/` (本リポジトリのルート)
- **API の場所**: 空欄 (バックエンドは別 Function App)
- **出力の場所**: `out`
- **ビルドプリセット**: Next.js
- **環境変数 `NEXT_PUBLIC_API_URL`**: Azure Functions の URL を SWA の構成で設定

push のたびに GitHub Actions が自動ビルド + デプロイ。
