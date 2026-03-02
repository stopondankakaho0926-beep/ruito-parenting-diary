import { LogoutButton } from '@/components/auth/LogoutButton'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-orange-50">
      <nav className="bg-gradient-to-r from-green-100/80 to-amber-100/80 backdrop-blur-sm border-b-4 border-green-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <span className="text-4xl">✍️</span>
                <Link href="/admin" className="text-2xl font-bold text-green-800 hover:text-orange-600 transition-colors">
                  るいとの日記管理
                </Link>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
                <Link
                  href="/admin"
                  className="text-green-700 hover:text-orange-600 hover:bg-white/50 inline-flex items-center px-4 py-2 rounded-full text-base font-medium transition-all"
                >
                  📚 日記一覧
                </Link>
                <Link
                  href="/admin/articles/new"
                  className="text-green-700 hover:text-orange-600 hover:bg-white/50 inline-flex items-center px-4 py-2 rounded-full text-base font-medium transition-all"
                >
                  ✨ 新しい日記
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="text-green-700 hover:text-orange-600 hover:bg-white/50 inline-flex items-center px-4 py-2 rounded-full text-base font-medium transition-all"
                >
                  👀 サイトを見る
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
