import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCanteenById } from '../api/canteens'
import DishCard from '../components/DishCard'
import { formatRating } from '../utils/format'

const shadowColors = ['var(--color-shadow-blue)', 'var(--color-shadow-green)', 'var(--color-shadow-amber)']

export default function CanteenDetailPage() {
  const { canteenId } = useParams<{ canteenId: string }>()
  const navigate = useNavigate()
  const [canteen, setCanteen] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!canteenId) return
    setLoading(true)
    getCanteenById(canteenId)
      .then((data) => setCanteen(data))
      .catch((err) => {
        console.error('Failed to load canteen:', err)
        setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [canteenId])

  if (loading) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--color-muted)' }}>
        加载中...
      </div>
    )
  }

  if (notFound || !canteen) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--color-muted)' }}>
        食堂不存在
      </div>
    )
  }

  const canteenWindows = canteen.windows ?? []

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header with back button */}
      <div
        className="p-5"
        style={{
          background: 'var(--color-ink)',
          borderBottom: '5px solid var(--color-ink)',
          paddingTop: 'max(48px, calc(env(safe-area-inset-top, 0px) + 12px))',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-3 text-white text-sm font-bold flex items-center gap-1"
        >
          ← 返回
        </button>
        <h1 className="text-white text-xl font-black">{canteen.name}</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {canteen.description}
        </p>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span
            className="text-xs font-bold px-2 py-0.5"
            style={{
              background: 'var(--color-soft-amber)',
              color: '#6B4E16',
              borderRadius: 'var(--radius-pill)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            📍 {canteen.location}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5"
            style={{
              background: 'var(--color-soft-blue)',
              color: 'var(--color-blue)',
              borderRadius: 'var(--radius-pill)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            ⭐ {formatRating(canteen.rating)}
          </span>
        </div>
      </div>

      {/* Windows */}
      <div className="px-4 -mt-4">
        {canteenWindows.length === 0 && (
          <div
            className="mt-6 text-center py-10 px-4"
            style={{
              border: '3px solid var(--color-ink)',
              borderRadius: '22px',
              background: 'white',
              boxShadow: '7px 7px 0 var(--color-shadow-blue)',
            }}
          >
            <div className="text-5xl mb-3">🏪</div>
            <p className="font-black text-base mb-1" style={{ color: 'var(--color-ink)' }}>暂无窗口数据</p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>该食堂还没有录入窗口和菜品信息</p>
          </div>
        )}
        {canteenWindows.map((win: any, winIdx: number) => {
          const winDishes = win.dishes ?? []
          return (
            <div key={win.id} className="mt-6">
              <div
                className="p-4 bg-white"
                style={{
                  border: '2px solid var(--color-ink)',
                  borderRadius: '22px',
                  boxShadow: `6px 6px 0 ${shadowColors[winIdx % 3]}`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-black text-base">{win.name}</h2>
                  <span
                    className="text-xs font-bold px-2 py-0.5"
                    style={{
                      background:
                        win.status === 'open' ? 'var(--color-soft-green)' : 'var(--color-soft-red)',
                      color: win.status === 'open' ? 'var(--color-green)' : 'var(--color-red)',
                      borderRadius: 'var(--radius-pill)',
                      border: '2px solid var(--color-ink)',
                    }}
                  >
                    {win.status === 'open' ? '营业中' : '已关闭'}
                  </span>
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--color-muted)' }}>
                  {win.description}
                </p>
                <div className="flex flex-col gap-2">
                  {winDishes.map((dish: any) => (
                    <DishCard key={dish.id} dish={dish} shadowColor={shadowColors[winIdx % 3]} />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed z-50 flex items-center justify-center transition-all duration-300"
          style={{
            bottom: 90,
            right: 20,
            width: 44,
            height: 44,
            background: 'var(--color-ink)',
            border: '3px solid var(--color-ink)',
            borderRadius: '50%',
            boxShadow: '3px 3px 0 var(--color-shadow-blue)',
            color: 'white',
            fontSize: '18px',
            opacity: showBackToTop ? 1 : 0,
            transform: showBackToTop ? 'scale(1)' : 'scale(0.5)',
          }}
        >
          ↑
        </button>
      )}
    </div>
  )
}
