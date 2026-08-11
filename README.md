# Nedaka. — Frontend (React)

睡眠記録を株価チャートに見立てて可視化するアプリ「Nedaka.（寝高）」のフロントエンドです。
[バックエンドAPI](https://github.com/yukisatodev/nedaka-backend)から取得したデータを、ローソク足チャートとして描画します。

🔗 **デモ（ログイン不要）**: https://gregarious-pony-811702.netlify.app/demo

## 作った背景

バックエンド側の詳しい制作背景は[nedaka-backendのREADME](https://github.com/yukisatodev/nedaka-backend)にまとめています。フロントエンドでは特に、「ローソク足チャートを外部グラフライブラリに頼らず、SVGで自分で組み立てる」ことにこだわりました。ポートフォリオサイトのスキルレーダーチャートを自作した経験を、そのまま別の形のデータ可視化に応用しています。

## 画面の構成

- **デモページ（ログイン不要）**: サンプルデータでチャート・アナリストコメント・決算レポートPDFをすぐに確認できる
- **ダッシュボード（要ログイン）**: 睡眠記録フォーム、ローソク足チャート、移動平均線、直近の値動き一覧
- **ログイン / アカウント登録**: JWT認証

## 使用技術

- React + Vite
- React Router（ページ遷移）
- 自作のSVGローソク足チャートコンポーネント（外部グラフライブラリ不使用）
- 素のCSS（ポートフォリオサイト・Site Checkと共通のデザイントークン）

## ローカルで動かす

```bash
npm install
npm run dev
```

`http://127.0.0.1:5173` が開きます。バックエンドのURLを変更したい場合は`.env`に以下を設定してください。

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## デプロイ

Netlifyで`npm run build`の`dist/`を公開しています。環境変数`VITE_API_BASE_URL`に本番のバックエンドURL（Render）を設定する必要があります。
