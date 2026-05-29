import { useNavigate } from 'react-router-dom'
import { formatRating } from '../utils/format'
import type { Canteen } from '../types'

const markColors = ['var(--color-blue)', 'var(--color-green)', 'var(--color-amber)']
const shadowColors = ['var(--color-shadow-blue)', 'var(--color-shadow-green)', 'var(--color-shadow-amber)']

interface CanteenCardProps {
  canteen: Canteen
  index: number
}

export default function CanteenCard({ canteen, index }: CanteenCardProps) {
  const navigate = useNavigate()
  const markColor = markColors[index % 3]
  const shadowColor = shadowColors[index % 3]

  return (
    <div
      onClick={() => navigate(`/canteens/${canteen.id}`)}
      className="relative p-4 bg-white transition-transform duration-150 active:scale-[0.99] cursor-pointer"
      style={{
        border: '3px solid var(--color-ink)',
        borderRadius: '24px',
        boxShadow: `8px 8px 0 ${shadowColor}`,
      }}
    >
      {/* Mark badge */}
      <div
        className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center text-white text-xs font-black"
        style={{
          background: markColor,
          borderRadius: '24px',
          border: '3px solid var(--color-ink)',
          boxShadow: `3px 3px 0 ${shadowColor}`,
        }}
      >
        {index + 1}
      </div>

      <div className="flex items-start gap-3">
        <div
          className="w-16 h-16 flex-shrink-0 flex items-center justify-center text-3xl"
          style={{
            background: 'var(--color-soft-amber)',
            borderRadius: '18px',
            border: '2px solid var(--color-ink)',
          }}
        >
          🏫
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-black text-base">{canteen.name}</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {canteen.description}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className="text-xs font-bold px-2 py-0.5"
              style={{
                background: 'var(--color-soft-blue)',
                color: 'var(--color-blue)',
                borderRadius: 'var(--radius-pill)',
                border: '2px solid var(--color-ink)',
              }}
            >
              {canteen.floors}层
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5"
              style={{
                background: 'var(--color-soft-green)',
                color: 'var(--color-green)',
                borderRadius: 'var(--radius-pill)',
                border: '2px solid var(--color-ink)',
              }}
            >
              {canteen.windowCount}个窗口
            </span>
            <span className="text-xs">⭐ {formatRating(canteen.rating)}</span>
            <span
              className="text-xs font-bold px-2 py-0.5"
              style={{
                background: canteen.status === 'open' ? 'var(--color-soft-green)' : 'var(--color-soft-red)',
                color: canteen.status === 'open' ? 'var(--color-green)' : 'var(--color-red)',
                borderRadius: 'var(--radius-pill)',
                border: '2px solid var(--color-ink)',
              }}
            >
              {canteen.status === 'open' ? '营业中' : '已关闭'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
