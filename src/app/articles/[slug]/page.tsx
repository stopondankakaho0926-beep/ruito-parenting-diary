import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArticleContent } from '@/components/article/ArticleContent'
import { Paywall } from '@/components/article/Paywall'
import { Comments } from '@/components/article/Comments'
import { getAccessibleContent } from '@/lib/utils/paywall'
import Link from 'next/link'

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ email?: string; purchased?: string }>
}) {
  const { slug } = await params
  const { email, purchased } = await searchParams

  const supabase = await createClient()

  // Fetch article
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !article) {
    notFound()
  }

  // Increment view count
  await supabase
    .from('articles')
    .update({ view_count: article.view_count + 1 })
    .eq('id', article.id)

  // Fetch comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', article.id)
    .eq('approved', true)
    .order('created_at', { ascending: false })

  // Get accessible content based on purchase status
  const { content, isPurchased, needsPurchase } = await getAccessibleContent(
    article.content,
    article.is_paid,
    article.id,
    email
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-100/80 to-amber-100/80 backdrop-blur-sm border-b-4 border-green-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-700 hover:text-orange-600 text-base font-bold transition-colors"
          >
            <span>🏠</span>
            日記一覧に戻る
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Purchase Success Message */}
        {purchased === 'true' && (
          <div className="mb-8 rounded-3xl bg-green-50 p-6 border-4 border-green-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✨</span>
              <p className="text-base font-bold text-green-800">
                購入ありがとうございます！全文をお読みいただけます。
              </p>
            </div>
          </div>
        )}

        <article className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border-4 border-green-100">
          {/* Article Header */}
          <div className="border-b-4 border-green-100 p-8 bg-gradient-to-br from-amber-50 to-green-50">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                    article.is_paid
                      ? isPurchased
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-orange-400 to-amber-400 text-white'
                      : 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                  }`}
                >
                  {article.is_paid
                    ? isPurchased
                      ? '購入済み ✨'
                      : `¥${(article.price! / 100).toLocaleString()} 🪙`
                    : '無料 ✨'}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white/80 text-green-700 border-2 border-green-200">
                  👀 {article.view_count + 1} 回見られました
                </span>
              </div>
              <time
                dateTime={article.created_at}
                className="text-sm text-green-600 font-medium"
              >
                📅 {new Date(article.created_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <h1 className="text-4xl font-bold text-green-800 mb-4">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-xl text-gray-700 leading-relaxed">{article.excerpt}</p>
            )}
          </div>

          {/* Article Content */}
          <div className="p-8">
            <ArticleContent content={content} />

            {/* Paywall */}
            {needsPurchase && !isPurchased && (
              <div className="mt-8">
                <Paywall
                  articleId={article.id}
                  title={article.title}
                  price={article.price!}
                />
              </div>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <Comments articleId={article.id} initialComments={comments || []} />
      </main>
    </div>
  )
}
