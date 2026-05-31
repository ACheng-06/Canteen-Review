import { useNavigate } from 'react-router-dom'
import { formatPrice, formatRating } from '../utils/format'
import { getCategoryVisual } from '../utils/categoryVisual'
import type { Dish } from '../types'

interface DishCardProps {
  dish: Dish
  shadowColor?: string
}

export default function DishCard({ dish, shadowColor = 'var(--color-shadow-blue)' }: DishCardProps) {
  const navigate = useNavigate()
  const visual = getCategoryVisual(dish.category)

  return (
    <div
      onClick={() => navigate(`/dishes/${dish.id}`)}
      className="flex gap-3 p-3 bg-white cursor-pointer"
      style={{
        border: '3px solid var(--color-ink)',
        borderRadius: 'var(--radius-card)',
        boxShadow: `6px 6px 0 ${shadowColor}`,
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
      }}
      onMouseDown={(e) => {
        const el = e.currentTarget
        el.style.transform = 'scale(0.96)'
        el.style.boxShadow = `3px 3px 0 ${shadowColor}`
      }}
      onMouseUp={(e) => {
        const el = e.currentTarget
        el.style.transform = 'scale(1)'
        el.style.boxShadow = `6px 6px 0 ${shadowColor}`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.transform = 'scale(1)'
        el.style.boxShadow = `6px 6px 0 ${shadowColor}`
      }}
      onTouchStart={(e) => {
        const el = e.currentTarget
        el.style.transform = 'scale(0.96)'
        el.style.boxShadow = `3px 3px 0 ${shadowColor}`
      }}
      onTouchEnd={(e) => {
        const el = e.currentTarget
        el.style.transform = 'scale(1)'
        el.style.boxShadow = `6px 6px 0 ${shadowColor}`
      }}
    >
      {/* Image */}
      <div
        className="w-[72px] h-[72px] flex-shrink-0 flex items-center justify-center text-4xl"
        style={{
          background: visual.bg,
          borderRadius: '16px',
          border: '2px solid var(--color-ink)',
        }}
      >
        {visual.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-black text-base truncate">{dish.name}</span>
          <span
            className="text-xs font-bold px-2 py-0.5"
            style={{
              background: 'var(--color-soft-blue)',
              color: 'var(--color-blue)',
              borderRadius: 'var(--radius-pill)',
              border: '2px solid var(--color-ink)',
            }}
          >
            {formatPrice(dish.price)}
          </span>
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>
          {dish.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs">⭐ {formatRating(dish.rating)}</span>
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {dish.reviewCount}条评价
          </span>
        </div>
      </div>
    </div>
  )
}
