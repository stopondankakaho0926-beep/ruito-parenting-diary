'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Article = Database['public']['Tables']['articles']['Row']

export function ArticleList({ articles }: { articles: Article[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`「${title}」を削除してもよろしいですか？`)) {
      return
    }

    setDeleting(id)
    const supabase = createClient()

    const { error } = await supabase.from('articles').delete().eq('id', id)

    if (error) {
      alert('削除に失敗しました')
      setDeleting(null)
      return
    }

    router.refresh()
  }

  const formatPrice = (price: number | null) => {
    if (!price) return '無料'
    return `¥${(price / 100).toLocaleString()}`
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {articles.map((article) => (
          <li key={article.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {article.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {article.published ? '公開中' : '下書き'}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.is_paid
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {article.is_paid
                        ? formatPrice(article.price)
                        : '無料'}
                    </span>
                  </div>
                  {article.excerpt && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    作成日: {new Date(article.created_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <Link
                    href={`/articles/${article.slug}`}
                    target="_blank"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    プレビュー
                  </Link>
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id, article.title)}
                    disabled={deleting === article.id}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {deleting === article.id ? '削除中...' : '削除'}
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
