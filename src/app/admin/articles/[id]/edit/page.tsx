import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ArticleForm } from '@/components/editor/ArticleForm'
import { notFound } from 'next/navigation'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth()
  const { id } = await params
  const supabase = await createClient()

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .eq('author_id', user.id)
    .single()

  if (error || !article) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-4 border-green-100 shadow-lg">
        <span className="text-5xl">✏️</span>
        <h1 className="text-3xl font-bold text-green-800">日記を編集</h1>
      </div>
      <ArticleForm article={article} />
    </div>
  )
}
