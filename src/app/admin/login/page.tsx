import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-green-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm rounded-3xl p-10 border-4 border-green-100 shadow-2xl">
        <div className="text-center">
          <div className="text-7xl mb-4">👶</div>
          <h2 className="text-3xl font-bold text-green-800">
            るいとの日記
          </h2>
          <p className="mt-3 text-base text-green-700">
            日記を書くにはログインしてね 🌸
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
