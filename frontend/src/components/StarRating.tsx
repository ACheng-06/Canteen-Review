interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
}

const sizeMap = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' }

export default function StarRating({
  rating,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  const rounded = Math.round(rating * 2) / 2 // Round to nearest 0.5

  return (
    <div className={`flex items-center gap-0.5 ${sizeMap[size]}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rounded)
        const half = !filled && rounded > i && rounded < i + 1
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            {filled ? '⭐' : half ? '✨' : '☆'}
          </button>
        )
      })}
    </div>
  )
}
