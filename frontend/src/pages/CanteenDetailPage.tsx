import { useParams, useNavigate } from 'react-router-dom'
import { canteens, windows, dishes } from '../mock'
import DishCard from '../components/DishCard'
import { formatRating } from '../utils/format'

const shadowColors = ['var(--color-shadow-blue)', 'var(--color-shadow-green)', 'var(--color-shadow-amber)']

export default function CanteenDetailPage() {
  const { canteenId } = useParams<{ canteenId: string }>()
  const navigate = useNavigate()

  const canteen = canteens.find((c) => c.id === canteenId)
  if (!canteen) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--color-muted)' }}>
        食堂不存在 😅
      </div>
    )
  }

  const canteenWindows = windows.filter((w) => w.canteenId === canteenId)

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header with back button */}
      <div
        className="p-5 pb-8"
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
      <div className="px-4 -mt-4 pb-[200px]">
        {canteenWindows.map((win, winIdx) => {
          const winDishes = dishes.filter((d) => d.windowId === win.id)
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
                  {winDishes.map((dish) => (
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
