import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-paper)' }}>
      <div
        className="w-full max-w-[360px] p-6"
        style={{
          background: 'white',
          border: '3px solid var(--color-ink)',
          borderRadius: '28px',
          boxShadow: '10px 10px 0 var(--color-shadow-blue)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-sm font-bold flex items-center gap-1"
          style={{ color: 'var(--color-muted)' }}
        >
          ← 返回首页
        </button>
        <h1 className="text-shadow-pop font-black text-2xl text-center mb-6">登录</h1>

        {error && (
          <div
            className="mb-4 p-3 text-sm font-bold text-center"
            style={{
              background: 'var(--color-soft-red)',
              color: 'var(--color-red)',
              border: '2px solid var(--color-ink)',
              borderRadius: '14px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold block mb-1">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              required
              className="w-full px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--color-bg)',
                border: '3px solid var(--color-ink)',
                borderRadius: '16px',
              }}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              className="w-full px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--color-bg)',
                border: '3px solid var(--color-ink)',
                borderRadius: '16px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-black transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #172033 0%, #172033 58%, #FF4FB8 58%, #FF4FB8 100%)',
              color: 'white',
              border: '3px solid var(--color-ink)',
              borderRadius: '18px',
              boxShadow: '7px 7px 0 var(--color-amber)',
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--color-muted)' }}>
          没有账号？{' '}
          <Link to="/register" className="font-bold" style={{ color: 'var(--color-blue)' }}>
            去注册
          </Link>
        </p>
      </div>
    </div>
  )
}
