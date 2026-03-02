'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Comment = Database['public']['Tables']['comments']['Row']

interface CommentsProps {
  articleId: string
  initialComments: Comment[]
}

export function Comments({ articleId, initialComments }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    if (!name.trim() || !text.trim()) {
      setError('お名前とコメントを入力してください')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('comments')
        .insert({
          article_id: articleId,
          commenter_name: name.trim(),
          comment_text: text.trim(),
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Add new comment to the list
      if (data) {
        setComments([data, ...comments])
        setName('')
        setText('')
        setSuccess(true)
      }
    } catch (err: any) {
      setError('コメントの投稿に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-4 border-green-100 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">💬</span>
        <h3 className="text-2xl font-bold text-green-800">
          コメント ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-green-700 mb-2">
              お名前 🌸
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-2xl focus:outline-none focus:border-orange-300 transition-colors"
              placeholder="例: おばあちゃん"
              required
            />
          </div>

          <div>
            <label htmlFor="text" className="block text-sm font-medium text-green-700 mb-2">
              メッセージ 💕
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-2xl focus:outline-none focus:border-orange-300 transition-colors"
              placeholder="るいとくんへのメッセージを書いてね"
              required
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-2xl bg-green-50 border-2 border-green-200">
              <p className="text-sm text-green-700">✨ コメントを投稿しました！</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-full font-bold text-white bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '投稿中...' : '💌 コメントする'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-green-50 border-2 border-green-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">👤</span>
                <span className="font-bold text-green-800">{comment.commenter_name}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(comment.created_at).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {comment.comment_text}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-3">🌸</div>
            <p className="text-gray-600">まだコメントがありません</p>
            <p className="text-sm text-gray-500 mt-1">最初のコメントを書いてみませんか？</p>
          </div>
        )}
      </div>
    </div>
  )
}
