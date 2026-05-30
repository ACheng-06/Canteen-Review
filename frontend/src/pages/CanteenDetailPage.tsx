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
    <div className="min-h-screen -mt-7" style={{ background: 'var(--color-bg)' }}>
      {/* Header with back button */}
      <div
        className="p-5 pt-12"
        style={{
          background: 'var(--color-ink)',
          borderBottom: '5px solid var(--color-ink)',
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
        {canteenWindows.map((win: any, winIdx: number) => {
          const winDishes = win.dishes ?? []
          return (
            <div key={win.id} className="mt-6">
              <div
                className="p-4 bg-white"
                style={{
                  border: '3px solid var(--color-ink)',
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
    </div>
  )
}
