interface PaywallProps {
  articleId: string
  title: string
  price: number
}

export function Paywall({ articleId, title, price }: PaywallProps) {
  // Check if Stripe is configured
  const isStripeConfigured =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('dummy')

  return (
    <div className="border-t-4 border-green-200 bg-gradient-to-br from-amber-50 to-green-50 p-8 rounded-3xl shadow-lg">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-3xl font-bold text-green-800 mb-3">
          ここから先は有料コンテンツです
        </h3>
        {isStripeConfigured ? (
          <p className="text-gray-700 text-lg mb-6">
            続きを読むには購入が必要です
          </p>
        ) : (
          <div className="bg-white/80 p-6 rounded-2xl border-2 border-green-200 mb-6">
            <div className="text-5xl mb-3">🚧</div>
            <p className="text-gray-700 text-base font-bold mb-2">
              決済機能は準備中です
            </p>
            <p className="text-sm text-gray-600">
              この記事は有料コンテンツとして設定されていますが、<br />
              現在Stripeの設定が完了していないため購入できません。
            </p>
          </div>
        )}
      </div>

      {!isStripeConfigured && (
        <div className="mt-6 pt-6 border-t-2 border-green-200">
          <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
            <span>📝</span>
            <span>管理者の方へ</span>
          </h4>
          <p className="text-sm text-gray-600">
            Stripeを設定すると、有料記事の販売が可能になります。<br />
            <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              README.md
            </code>{' '}
            の「Stripeセットアップ」セクションを参照してください。
          </p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t-2 border-green-200">
        <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
          <span>✨</span>
          <span>購入するとできること:</span>
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-lg">📖</span>
            <span>記事の全文を閲覧できます</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-lg">♾️</span>
            <span>買い切りで何度でも読み直せます</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-lg">📧</span>
            <span>メールアドレスで簡単アクセス</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
