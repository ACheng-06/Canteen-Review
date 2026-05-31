import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDishById, getDishReviews, submitReview } from '../api/dishes'
import { useAuthStore } from '../stores/useAuthStore'
import { useFavoriteStore } from '../stores/useFavoriteStore'
import { useHistoryStore } from '../stores/useHistoryStore'
import { formatPrice, formatRating } from '../utils/format'
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'
import StarRating from '../components/StarRating'
import type { Dish, Review } from '../types'

export default function DishDetailPage() {
  const { dishId } = useParams<{ dishId: string }>()
  const navigate = useNavigate()

  const [dish, setDish] = useState<(Dish & { windowName?: string; canteenName?: string }) | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const { isFavorite, toggleFavorite } = useFavoriteStore()
  const { addHistory } = useHistoryStore()
  const user = useAuthStore((s) => s.user)

  const fetchReviews = useCallback(async (id: string) => {
    try {
      const res = await getDishReviews(id)
      setReviews(res.data)
    } catch (err) {
      console.error('Failed to load reviews:', err)
    }
  }, [])

  useEffect(() => {
    if (!dishId) return
    addHistory(dishId)
    setLoading(true)

    Promise.all([
      getDishById(dishId).then((data) => setDish(data)),
      fetchReviews(dishId),
    ])
      .catch((err) => {
        console.error('Failed to load dish:', err)
        setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [dishId, addHistory, fetchReviews])

  if (loading) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--color-muted)' }}>
        加载中...
      </div>
    )
  }

  if (notFound || !dish) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--color-muted)' }}>
        菜品不存在
      </div>
    )
  }

  const fav = isFavorite(dish.id)

  const handleSubmit = async (rating: number, content: string) => {
    if (!user) {
      alert('请先登录后再提交评价')
      return
    }
    try {
      await submitReview(dish.id, rating, content)
      // 重新拉取评价列表
      await fetchReviews(dish.id)
    } catch (err) {
      console.error('Failed to submit review:', err)
      alert('提交评价失败，请重试')
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div
        className="p-5"
        style={{
          background: 'var(--color-ink)',
          borderBottom: '5px solid var(--color-ink)',
          paddingTop: 'max(48px, calc(env(safe-area-inset-top, 0px) + 12px))',
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
            <span className="text-sm font-bold">{dish.canteenName}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              窗口
            </span>
            <span className="text-sm font-bold">{dish.windowName}</span>
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
          {user ? (
            <ReviewForm onSubmit={handleSubmit} />
          ) : (
            <div
              className="p-4 bg-white text-center"
              style={{
                border: '3px solid var(--color-ink)',
                borderRadius: '22px',
                boxShadow: '7px 7px 0 var(--color-shadow-amber)',
              }}
            >
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                请先{' '}
                <span
                  className="font-bold cursor-pointer"
                  style={{ color: 'var(--color-blue)' }}
                  onClick={() => navigate('/login')}
                >
                  登录
                </span>{' '}
                后再提交评价
              </p>
            </div>
          )}
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
