import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
  }

  const formatPrice = (price: number | null) => {
    if (!price) return '無料'
    return `¥${(price / 100).toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-orange-50">
      {/* Header with Ghibli style */}
      <header className="relative overflow-hidden bg-gradient-to-r from-green-100/80 to-amber-100/80 backdrop-blur-sm border-b-4 border-green-200">
        <div className="absolute top-0 right-0 text-9xl opacity-10">👶</div>
        <div className="absolute bottom-0 left-0 text-7xl opacity-10">🌸</div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-6xl">👶</span>
            <h1 className="text-5xl font-bold text-green-800">
              るいとの育児日記
            </h1>
          </div>
          <p className="mt-4 text-xl text-green-700 font-light ml-20">
            すくすく成長記録 🌱✨
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {articles && articles.length > 0 ? (
          <div className="space-y-8">
            {articles.map((article, index) => {
              const foodEmojis = ['👶', '🍼', '🌸', '🎀', '🧸', '🌈', '⭐', '💕']
              const emoji = foodEmojis[index % foodEmojis.length]

              return (
                <article
                  key={article.id}
                  className="group relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border-4 border-green-100 hover:border-amber-200 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2"
                >
                  <Link href={`/articles/${article.slug}`}>
                    <div className="p-8">
                      <div className="flex items-start gap-6 mb-4">
                        <div className="text-6xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {emoji}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-3xl font-bold text-green-800 group-hover:text-orange-600 transition-colors duration-300 mb-2">
                            {article.title}
                          </h2>
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                              article.is_paid
                                ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-white'
                                : 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                            }`}
                          >
                            {article.is_paid
                              ? `${formatPrice(article.price)} 🪙`
                              : '無料 ✨'}
                          </span>
                        </div>
                      </div>
                      {article.excerpt && (
                        <p className="text-gray-700 text-lg leading-relaxed line-clamp-2 mb-6 ml-20">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between ml-20">
                        <time className="text-sm text-green-600 font-medium" dateTime={article.created_at}>
                          📅 {new Date(article.created_at).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                        <span className="text-orange-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          読んでみる 🌿
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-4 border-green-100">
              <div className="text-8xl mb-4">👶</div>
              <p className="text-gray-600 text-xl font-medium">まだ日記がありません</p>
              <p className="text-gray-500 text-sm mt-2">るいとの成長記録を書き始めましょう 🌱</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t-4 border-green-200 bg-gradient-to-r from-green-100/50 to-amber-100/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-2xl">👶</span>
            <span className="text-2xl">💕</span>
            <span className="text-2xl">🌸</span>
          </div>
          <p className="text-center text-green-700 text-sm font-medium">
            © 2026 るいとの育児日記. すくすく育ちますように 🌱
          </p>
        </div>
      </footer>
    </div>
  )
}
