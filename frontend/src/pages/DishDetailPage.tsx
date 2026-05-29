import { useParams, useNavigate } from 'react-router-dom'
import { dishes, canteens, windows } from '../mock'
import { useReviewStore } from '../stores/useReviewStore'
import { useFavoriteStore } from '../stores/useFavoriteStore'
import { useHistoryStore } from '../stores/useHistoryStore'
import { currentUser } from '../mock'
import { formatPrice, formatRating } from '../utils/format'
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'
import StarRating from '../components/StarRating'
import { useEffect } from 'react'

export default function DishDetailPage() {
  const { dishId } = useParams<{ dishId: string }>()
  const navigate = useNavigate()

  const dish = dishes.find((d) => d.id === dishId)
  const { getDishReviews, addReview } = useReviewStore()
  const { isFavorite, toggleFavorite } = useFavoriteStore()
  const { addHistory } = useHistoryStore()

  useEffect(() => {
    if (dishId) addHistory(dishId)
  }, [dishId, addHistory])

  if (!dish) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--color-muted)' }}>
        菜品不存在 😅
      </div>
    )
  }

  const canteen = canteens.find((c) => c.id === dish.canteenId)
  const window = windows.find((w) => w.id === dish.windowId)
  const reviews = getDishReviews(dish.id)
  const fav = isFavorite(dish.id)

  const handleSubmit = (rating: number, content: string) => {
    addReview({
      dishId: dish.id,
      userId: currentUser.id,
      userName: currentUser.nickname,
      avatar: currentUser.avatar,
      rating,
      content,
    })
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div
        className="p-5 pb-8"
        style={{
          background: 'var(--color-ink)',
          borderBottom: '5px solid var(--color-ink)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-sm font-bold"
          >
            ← 返回
          </button>
          <button
            onClick={() => toggleFavorite(dish.id)}
            className="text-2xl"
          >
            {fav ? '❤️' : '🤍'}
          </button>
        </div>

        <div
          className="w-20 h-20 mx-auto flex items-center justify-center text-4xl mb-3"
          style={{
            background: 'var(--color-soft-amber)',
            borderRadius: '24px',
            border: '3px solid rgba(255,255,255,0.3)',
          }}
        >
          🍽️
        </div>

        <h1 className="text-white text-xl font-black text-center">{dish.name}</h1>
        <p
          className="text-sm text-center mt-1"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          {dish.description}
        </p>

        <div className="flex items-center justify-center gap-3 mt-3">
          <span
            className="text-sm font-black px-3 py-1"
            style={{
              background: 'var(--color-soft-amber)',
              color: '#6B4E16',
              borderRadius: 'var(--radius-pill)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            {formatPrice(dish.price)}
          </span>
          <span
            className="text-sm font-bold px-3 py-1"
            style={{
              background: 'var(--color-soft-blue)',
              color: 'var(--color-blue)',
              borderRadius: 'var(--radius-pill)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            ⭐ {formatRating(dish.rating)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-4 pb-[120px]">
        {/* Info card */}
        <div
          className="p-4 bg-white mb-4"
          style={{
            border: '3px solid var(--color-ink)',
            borderRadius: '22px',
            boxShadow: '7px 7px 0 var(--color-shadow-blue)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              所属食堂
            </span>
            <span className="text-sm font-bold">{canteen?.name}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              窗口
            </span>
            <span className="text-sm font-bold">{window?.name}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              评分
            </span>
            <StarRating rating={dish.rating} size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              标签
            </span>
            <div className="flex gap-1">
              {dish.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold px-2 py-0.5"
                  style={{
                    background: 'var(--color-soft-amber)',
                    borderRadius: 'var(--radius-pill)',
                    border: '2px solid var(--color-ink)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Review form */}
        <div className="mb-4">
          <ReviewForm onSubmit={handleSubmit} />
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-shadow-pop-soft text-lg font-black mb-3">
            评价 ({reviews.length})
          </h2>
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  )
}
