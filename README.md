# Note風有料記事販売プラットフォーム

個人向けの有料記事販売Webサービス。Noteのように無料記事と有料記事を切り替えて投稿でき、記事の途中から有料にすることも可能です。

## 主な機能

- ✅ 管理者ログイン（Supabase Auth）
- ✅ 記事CRUD（作成・編集・削除・一覧）
- ✅ Notion風リッチエディター（Novel Editor / Tiptap）
- ✅ 無料/有料記事の切り替え
- ✅ Paywall機能（記事の途中から有料化）
- ✅ Stripe決済統合（買い切り）
- ✅ 読者向けフロントエンド（記事一覧・詳細）
- ✅ 購入済み判定（メールアドレスベース）

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **データベース**: PostgreSQL (Supabase)
- **認証**: Supabase Auth
- **決済**: Stripe
- **エディター**: Novel Editor (Tiptap)

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseのセットアップ

1. [Supabase](https://supabase.com)でアカウント作成
2. 新規プロジェクトを作成
3. SQL Editorで `supabase/migrations/001_create_tables.sql` を実行
4. API設定から以下の値を取得:
   - Project URL
   - anon/public key
   - service_role key（Webhookで使用）

詳細は `supabase/README.md` を参照してください。

### 3. Stripeのセットアップ

1. [Stripe](https://stripe.com)でアカウント作成
2. ダッシュボードから以下の値を取得:
   - Publishable key
   - Secret key
3. Webhookエンドポイントを設定:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - イベント: `checkout.session.completed`
   - Webhook signing secretを取得

テスト中はStripe CLIを使用できます:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 4. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成:

```bash
cp .env.local.example .env.local
```

以下の値を設定:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. 管理者アカウントの作成

1. Supabaseダッシュボード → Authentication → Users
2. "Add user" をクリック
3. メールアドレスとパスワードを設定
4. 作成されたユーザーIDをメモ（記事作成時に必要）

### 6. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 使い方

### 管理者として記事を作成

1. `/admin/login` にアクセスしてログイン
2. 「新規記事作成」をクリック
3. タイトル、本文を入力
4. 有料記事にする場合:
   - 「有料記事にする」にチェック
   - 価格を設定（円単位）
   - エディターで「Paywall挿入」ボタンをクリックして無料/有料の境界を設定
5. 「公開する」をクリック

### 読者として記事を購入

1. トップページ（`/`）で記事一覧を閲覧
2. 記事をクリックして詳細ページへ
3. 無料部分を読んだ後、Paywallが表示される
4. メールアドレスを入力して「購入する」ボタンをクリック
5. Stripe Checkoutページで決済
6. 決済完了後、記事の全文が閲覧可能に

### 購入済み記事へのアクセス

購入時に使用したメールアドレスをURLに追加:
```
https://your-domain.com/articles/your-article-slug?email=your@email.com
```

## プロジェクト構造

```
note-sales-platform/
├── src/
│   ├── app/
│   │   ├── admin/              # 管理画面
│   │   │   ├── articles/       # 記事CRUD
│   │   │   ├── login/          # ログインページ
│   │   │   └── page.tsx        # ダッシュボード
│   │   ├── api/
│   │   │   └── stripe/         # Stripe API routes
│   │   │       ├── checkout/   # Checkout Session作成
│   │   │       └── webhook/    # Webhook handler（重要）
│   │   ├── articles/[slug]/    # 記事詳細ページ
│   │   └── page.tsx            # トップページ
│   ├── components/
│   │   ├── admin/              # 管理画面コンポーネント
│   │   ├── article/            # 記事表示コンポーネント
│   │   ├── auth/               # 認証コンポーネント
│   │   ├── editor/             # Novel Editorラッパー
│   │   └── payment/            # 決済コンポーネント
│   ├── lib/
│   │   ├── supabase/           # Supabaseクライアント
│   │   ├── utils/              # ユーティリティ関数
│   │   ├── auth.ts             # 認証ヘルパー
│   │   └── stripe.ts           # Stripe初期化
│   └── types/
│       └── database.ts         # TypeScript型定義
├── supabase/
│   ├── migrations/             # データベースマイグレーション
│   └── README.md               # Supabaseセットアップガイド
└── README.md                   # このファイル
```

## データベーススキーマ

### articles（記事）
- id, title, slug, content, excerpt
- published（公開/下書き）
- is_paid（無料/有料）
- price（価格、円単位）
- paywall_position（無料部分の終了位置）
- author_id（作成者）

### purchases（購入履歴）
- id, article_id, user_email
- stripe_payment_id（Stripe決済ID）
- status（completed, refunded等）
- purchased_at（購入日時）

### subscriptions（サブスクリプション）
※ Phase 2で実装予定

## セキュリティ

- すべてのテーブルでRow Level Security（RLS）を有効化
- Webhook署名検証を実装
- 管理画面は認証必須
- CORS設定済み

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com)で新規プロジェクト作成
3. 環境変数を設定（Production用の値を使用）
4. デプロイ

### 重要な注意事項

- **Webhook URL**: デプロイ後、Stripeダッシュボードで本番用WebhookエンドポイントURLを設定
- **環境変数**: `NEXT_PUBLIC_APP_URL` を本番URLに更新
- **SUPABASE_SERVICE_ROLE_KEY**: 必ず設定（Webhook処理で必要）

## トラブルシューティング

### Webhookが動作しない
- Stripe CLIでローカルテスト: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Webhook署名が正しいか確認
- ログを確認: `console.error` の出力をチェック

### 購入後も記事が表示されない
- `purchases` テーブルに記録されているか確認
- メールアドレスが正しいか確認
- Stripe Webhookが正常に処理されているか確認

### ログインできない
- Supabaseで管理者ユーザーが作成されているか確認
- 環境変数が正しく設定されているか確認

## 今後の拡張予定

- [ ] サブスクリプション機能（全記事読み放題）
- [ ] 画像アップロード（Supabase Storage）
- [ ] 記事検索・タグ機能
- [ ] アナリティクス（閲覧数、購入率）
- [ ] コメント機能
- [ ] SNSシェア機能
- [ ] メール通知（購入完了、新記事公開）

## ライセンス

MIT License
