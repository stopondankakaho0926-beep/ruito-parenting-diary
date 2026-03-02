'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useEffect } from 'react'

interface NovelEditorProps {
  value: string
  onChange: (value: string) => void
}

export function NovelEditor({ value, onChange }: NovelEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'rounded-lg shadow-md max-w-full h-auto',
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sync external value changes to editor
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  const insertPaywallMarker = () => {
    if (editor) {
      editor.chain().focus().insertContent('<!--paywall-->').run()
    }
  }

  const addImage = () => {
    const url = window.prompt('画像のURLを入力してください 📸')

    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border-4 border-green-100 rounded-3xl overflow-hidden shadow-lg">
      {/* Toolbar */}
      <div className="border-b-4 border-green-100 bg-gradient-to-r from-green-50 to-amber-50 p-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-3 py-2 text-sm rounded-full font-bold transition-all ${
            editor?.isActive('bold')
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-green-100 border-2 border-green-200'
          }`}
        >
          <strong>B</strong> 太字
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-3 py-2 text-sm rounded-full font-bold transition-all ${
            editor?.isActive('italic')
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-green-100 border-2 border-green-200'
          }`}
        >
          <em>I</em> 斜体
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-2 text-sm rounded-full font-bold transition-all ${
            editor?.isActive('heading', { level: 2 })
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-green-100 border-2 border-green-200'
          }`}
        >
          H2 見出し
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`px-3 py-2 text-sm rounded-full font-bold transition-all ${
            editor?.isActive('bulletList')
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-green-100 border-2 border-green-200'
          }`}
        >
          • リスト
        </button>
        <div className="border-l-2 border-green-300 mx-2"></div>
        <button
          type="button"
          onClick={addImage}
          className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-orange-400 to-amber-400 text-white hover:from-orange-500 hover:to-amber-500 font-bold shadow-md transition-all"
          title="画像を挿入します"
        >
          📸 画像
        </button>
        <button
          type="button"
          onClick={insertPaywallMarker}
          className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500 font-bold shadow-md transition-all"
          title="この位置から有料コンテンツにします"
        >
          💰 Paywall
        </button>
      </div>

      {/* Editor */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Help Text */}
      <div className="border-t-4 border-green-100 bg-gradient-to-r from-amber-50 to-green-50 p-4">
        <div className="flex flex-wrap gap-4 text-xs text-green-700">
          <div className="flex items-center gap-2">
            <span className="text-lg">📸</span>
            <span>画像ボタンで画像URLを入力</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <span>Paywallで無料/有料を分ける</span>
          </div>
        </div>
      </div>
    </div>
  )
}
