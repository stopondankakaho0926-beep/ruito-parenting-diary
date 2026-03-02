# クイックスタートガイド

このガイドに従えば、5分でプラットフォームをセットアップできます。

## 必要なもの

- ✅ Node.js（既にインストール済み）
- 📧 メールアドレス（Supabase、Stripe用）

## セットアップステップ

### Step 1: 環境変数ファイルを作成

```bash
cp .env.local.example .env.local
```

`.env.local` を開いて、以下の値を設定します（まず空白のままでOK、後で追加）。

### Step 2: Supabaseアカウント作成（3分）

1. https://supabase.com にアクセス
2. "Start your project" をクリック
3. GitHubアカウントでサインアップ
4. "New project" をクリック
5. プロジェクト名: `note-platform`（任意）
6. Database Password: 強力なパスワードを設定
7. Region: Northeast Asia (Tokyo) を選択
8. "Create new project" をクリック（1-2分待つ）

### Step 3: データベースセットアップ（1分）

1. 左サイドバーから "SQL Editor" をクリック
2. `supabase/migrations/001_create_tables.sql` ファイルの内容をコピー
3. SQL Editorにペースト
4. "Run" ボタンをクリック
5. ✅ Success と表示されればOK

### Step 4: Supabase APIキーを取得（30秒）

1. 左サイドバーから "Project Settings" → "API" をクリック
2. 以下の値をコピー:
   - **Project URL** → `.env.local` の `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `.env.local` の `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `.env.local` の `SUPABASE_SERVICE_ROLE_KEY`

### Step 5: 管理者ユーザーを作成（30秒）

1. 左サイドバーから "Authentication" → "Users" をクリック
2. "Add user" → "Create new user" をクリック
3. Email: あなたのメールアドレス
4. Password: ログイン用パスワード（8文字以上）
5. "Auto Confirm User" にチェック
6. "Create user" をクリック

### Step 6: Stripeアカウント作成（2分）

1. https://dashboard.stripe.com/register にアクセス
2. アカウントを作成（メール認証が必要）
3. "Skip this account form" をクリック（後で設定可能）
4. **テストモードであることを確認**（右上に "Test mode" と表示）

### Step 7: Stripe APIキーを取得（30秒）

1. Stripeダッシュボード → "Developers" → "API keys" をクリック
2. 以下の値をコピー:
   - **Publishable key** → `.env.local` の `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → "Reveal test key" をクリック → `.env.local` の `STRIPE_SECRET_KEY`

### Step 8: Stripe Webhookをセットアップ（1分）

新しいターミナルウィンドウを開いて:

```bash
# Stripe CLIをインストール（Homebrewが必要）
brew install stripe/stripe-cli/stripe

# Stripeにログイン
stripe login

# Webhookをローカルに転送
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

表示される `whsec_...` で始まる文字列をコピー → `.env.local` の `STRIPE_WEBHOOK_SECRET`

⚠️ **重要**: このターミナルは開いたままにしてください！

### Step 9: 開発サーバーを起動（30秒）

元のターミナルに戻って:

```bash
npm run dev
```

http://localhost:3000 が自動的に開きます。

## 🎉 完了！

これで準備完了です。次のステップ:

### 1. 管理画面にログイン

1. http://localhost:3000/admin/login にアクセス
2. Step 5で作成したメールアドレスとパスワードでログイン
3. ダッシュボードが表示されます

### 2. 最初の記事を作成

1. "新規記事作成" をクリック
2. タイトル: "テスト記事"
3. 本文: 適当な文章を入力
4. "有料記事にする" にチェック
5. 価格: 500（円）
6. エディターで文章を書いた後、"💰 Paywall挿入" をクリック
7. Paywallマーカーの後に有料部分の文章を追加
8. "公開する" をクリック

### 3. 記事を表示してテスト購入

1. http://localhost:3000 にアクセス
2. 作成した記事をクリック
3. 無料部分が表示され、その後にPaywallが表示されます
4. メールアドレスを入力（任意のアドレスでOK）
5. "購入する" をクリック
6. Stripeのテストページに移動します
7. カード番号: `4242 4242 4242 4242`
8. 有効期限: 未来の任意の日付（例: 12/34）
9. CVC: 任意の3桁（例: 123）
10. "Pay" をクリック
11. 記事ページに戻り、全文が表示されます！

## トラブルシューティング

### エラー: "Supabaseに接続できません"
→ `.env.local` の設定を確認してください。`NEXT_PUBLIC_` で始まる変数が正しいか確認。

### エラー: "Webhookが動作しません"
→ Stripe CLIのターミナルが開いているか確認。閉じてしまった場合は再度 `stripe listen` を実行。

### ログインできない
→ Supabaseで "Auto Confirm User" にチェックを入れましたか？入れていない場合は、メールを確認してアカウントを有効化。

## 次のステップ

- `README.md` を読んで機能の詳細を確認
- `IMPLEMENTATION_NOTES.md` で技術的な詳細を確認
- 本番環境へのデプロイ準備（Vercelがおすすめ）

## サポートが必要ですか？

- GitHubでIssueを作成
- README.mdのトラブルシューティングセクションを確認
