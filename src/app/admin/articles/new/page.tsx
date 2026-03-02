import { requireAuth } from '@/lib/auth'
import { ArticleForm } from '@/components/editor/ArticleForm'

export default async function NewArticlePage() {
  await requireAuth()

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-4 border-green-100 shadow-lg">
        <span className="text-5xl">✍️</span>
        <h1 className="text-3xl font-bold text-green-800">新しい日記を書く</h1>
      </div>
      <ArticleForm />
    </div>
  )
}
