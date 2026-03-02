import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import { ArticleList } from '@/components/admin/ArticleList'

export default async function AdminDashboard() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-4 border-green-100 shadow-lg">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">📚</span>
            <h1 className="text-3xl font-bold text-green-800">るいとの成長日記</h1>
          </div>
          <p className="mt-3 text-base text-green-700 ml-14">
            これまでの記録 🌱✨
          </p>
        </div>
        <div className="mt-6 sm:mt-0">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-6 py-3 border-4 border-orange-200 rounded-full shadow-lg text-base font-bold text-white bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 transition-all hover:scale-105"
          >
            <span>✨</span>
            新しい日記を書く
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {articles && articles.length > 0 ? (
          <ArticleList articles={articles} />
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-12 bg-white/80 backdrop-blur-sm rounded-3xl border-4 border-green-100 shadow-lg">
              <div className="text-8xl mb-4">👶</div>
              <p className="text-gray-700 text-xl font-bold mb-2">まだ日記がありません</p>
              <p className="text-gray-600 mb-6">るいとの成長を記録しましょう 🌸</p>
              <Link
                href="/admin/articles/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 font-bold shadow-lg transition-all hover:scale-105"
              >
                <span>✨</span>
                最初の日記を書く
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
