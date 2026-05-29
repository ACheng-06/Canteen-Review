import type { Review } from '../types'
import { formatRelativeTime } from '../utils/format'
import StarRating from './StarRating'

interface ReviewListProps {
  reviews: Review[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div
        className="text-center py-6 text-sm"
        style={{ color: 'var(--color-muted)' }}
      >
        暂无评价，快来写第一条吧 ✨
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-3 bg-white"
          style={{
            border: '3px solid var(--color-ink)',
            borderRadius: '20px',
            boxShadow: '5px 5px 0 var(--color-shadow-blue)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{review.avatar}</span>
            <div className="flex-1">
              <div className="font-bold text-sm">{review.userName}</div>
              <div className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                {formatRelativeTime(review.createdAt)}
              </div>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-sm leading-relaxed">{review.content}</p>
          {review.likes > 0 && (
            <div className="mt-2 text-xs" style={{ color: 'var(--color-muted)' }}>
              👍 {review.likes}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
