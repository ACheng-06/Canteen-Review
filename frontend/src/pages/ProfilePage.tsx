import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useFavoriteStore } from '../stores/useFavoriteStore'
import { useHistoryStore } from '../stores/useHistoryStore'
import { getMyReviews } from '../api/auth'
import { getDishById } from '../api/dishes'
import { formatRelativeTime } from '../utils/format'
import type { Dish } from '../types'

type ExpandedSection = null | 'favorites' | 'history' | 'reviews'

interface MyReview {
  id: string
  dishId: string
  dishName: string
  rating: number
  content: string
  likes: number
  createdAt: string
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, fetchMe, isLoading: authLoading, token } = useAuthStore()
  const { favoriteDishIds } = useFavoriteStore()
  const { historyDishIds } = useHistoryStore()
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null)
  const [myReviews, setMyReviews] = useState<MyReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [favoriteDishes, setFavoriteDishes] = useState<Dish[]>([])
  const [historyDishes, setHistoryDishes] = useState<Dish[]>([])

  // Fetch user info on mount if token exists but user is null
  useEffect(() => {
    if (token && !user) {
      fetchMe()
    }
  }, [token, user, fetchMe])

  // Fetch my reviews when user is available
  useEffect(() => {
    if (!user) return
    setReviewsLoading(true)
    getMyReviews()
      .then((data) => setMyReviews(data))
      .catch(() => setMyReviews([]))
      .finally(() => setReviewsLoading(false))
  }, [user])

  // Fetch favorite dishes details
  useEffect(() => {
    if (favoriteDishIds.length === 0) {
      setFavoriteDishes([])
      return
    }
    Promise.all(favoriteDishIds.map((id) => getDishById(id).catch(() => null)))
      .then((results) => setFavoriteDishes(results.filter(Boolean) as Dish[]))
  }, [favoriteDishIds])

  // Fetch history dishes details
  useEffect(() => {
    if (historyDishIds.length === 0) {
      setHistoryDishes([])
      return
    }
    Promise.all(historyDishIds.map((id) => getDishById(id).catch(() => null)))
      .then((results) => setHistoryDishes(results.filter(Boolean) as Dish[]))
  }, [historyDishIds])

  const toggleSection = (section: 'favorites' | 'history' | 'reviews') => {
    setExpandedSection((prev) => (prev === section ? null : section))
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  // Not logged in: show login prompt
  if (!token || (!user && !authLoading)) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: 'var(--color-paper)' }}
      >
        <div
          className="text-center p-8 bg-white"
          style={{
            border: '4px solid var(--color-ink)',
            borderRadius: '30px',
            boxShadow: '10px 10px 0 var(--color-pink)',
          }}
        >
          <div className="text-5xl mb-4">👤</div>
          <h2 className="font-black text-xl mb-2">未登录</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
            登录后查看个人中心
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 text-white font-bold text-sm cursor-pointer"
            style={{
              background: 'var(--color-ink)',
              borderRadius: '16px',
              border: '3px solid var(--color-ink)',
              boxShadow: '5px 5px 0 var(--color-pink)',
            }}
          >
            去登录
          </button>
        </div>
      </div>
    )
  }

  // Loading state
  if (authLoading || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--color-paper)' }}
      >
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          加载中...
        </p>
      </div>
    )
  }

  return (
    <div
      className=""
      style={{ background: 'var(--color-paper)' }}
    >
      {/* Dark header */}
      <div
        className="relative px-6 pt-16 pb-20 overflow-hidden"
        style={{
          background: 'var(--color-ink)',
          borderBottom: '5px solid var(--color-ink)',
        }}
      >
        <p
          className="text-xs font-bold mb-2"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          校园生活账号
        </p>
        <h1 className="text-white text-3xl font-black">我的</h1>
      </div>

      {/* Profile card — overlaps header */}
      <div
        className="relative mx-4 -mt-12 p-5 bg-white"
        style={{
          border: '4px solid var(--color-ink)',
          borderRadius: '30px',
          boxShadow: '10px 10px 0 var(--color-pink)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-16 h-16 flex items-center justify-center text-3xl"
            style={{
              background: 'var(--color-soft-amber)',
              borderRadius: '34px',
              border: '4px solid var(--color-ink)',
              boxShadow: '5px 5px 0 var(--color-cyan)',
            }}
          >
            {user.avatar}
          </div>
          <div>
            <h2 className="font-black text-lg">{user.nickname}</h2>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              {user.bio}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div
          className="flex items-center justify-around mt-4 py-3"
          style={{
            background: 'var(--color-soft-amber)',
            border: '3px solid var(--color-ink)',
            borderRadius: '22px',
            boxShadow: '7px 7px 0 var(--color-yellow)',
          }}
        >
          <div className="text-center">
            <div className="text-lg font-black" style={{ color: 'var(--color-ink)' }}>
              {myReviews.length}
            </div>
            <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
              评价数
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black" style={{ color: 'var(--color-ink)' }}>
              {favoriteDishIds.length}
            </div>
            <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
              收藏数
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black" style={{ color: 'var(--color-ink)' }}>
              {historyDishIds.length}
            </div>
            <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
              浏览数
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 mt-6">
        <h3 className="text-base font-black mb-3">常用入口</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { emoji: '✍️', label: '我的评价', bg: '#EAF7F0' },
            { emoji: '❤️', label: '我的收藏', bg: '#FFF0F0' },
            { emoji: '📖', label: '浏览记录', bg: '#EAF3FF' },
            { emoji: '📝', label: '我的发布', bg: '#FFF6E0' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 py-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.97]"
              style={{
                border: '3px solid var(--color-ink)',
                borderRadius: '22px',
                boxShadow: '6px 6px 0 var(--color-shadow-amber)',
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center text-xl rounded-full"
                style={{ background: item.bg }}
              >
                {item.emoji}
              </div>
              <span className="text-[10px] font-bold" style={{ color: 'var(--color-ink)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* "我的内容" section */}
      <div className="px-4 mt-6">
        <h3 className="text-base font-black mb-3">我的内容</h3>
        <div className="flex flex-col gap-3">
          {/* Favorites menu item */}
          <div
            className="bg-white overflow-hidden transition-transform duration-150 active:scale-[0.99]"
            style={{
              border: '3px solid var(--color-ink)',
              borderRadius: '22px',
              boxShadow: '6px 6px 0 var(--color-shadow-blue)',
            }}
          >
            <div
              onClick={() => toggleSection('favorites')}
              className="flex items-center gap-3 p-4 cursor-pointer"
            >
              <div
                className="w-12 h-12 flex items-center justify-center text-2xl rounded-xl"
                style={{ background: '#FFF0F0' }}
              >
                ❤️
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">我的收藏</div>
                <div className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
                  收藏的窗口和菜品
                </div>
              </div>
              <div
                className="w-7 h-7 flex items-center justify-center rounded-full"
                style={{
                  background: 'var(--color-ink)',
                  transform: expandedSection === 'favorites' ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <span className="text-white text-xs font-bold">›</span>
              </div>
            </div>

            {/* Expanded favorites content */}
            {expandedSection === 'favorites' && (
              <div className="px-4 pb-4 pt-1">
                {favoriteDishes.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {favoriteDishes.map((dish) => (
                      <div
                        key={dish.id}
                        onClick={() => navigate(`/dishes/${dish.id}`)}
                        className="flex items-center gap-3 p-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.99]"
                        style={{
                          border: '3px solid var(--color-ink)',
                          borderRadius: '20px',
                          boxShadow: '5px 5px 0 var(--color-shadow-blue)',
                        }}
                      >
                        <span className="text-2xl">🍽️</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{dish.name}</div>
                          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                            ⭐ {dish.rating.toFixed(1)} · ¥{dish.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-xs text-center py-4"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    还没有收藏，快去探索美食吧
                  </p>
                )}
              </div>
            )}
          </div>

          {/* History menu item */}
          <div
            className="bg-white overflow-hidden transition-transform duration-150 active:scale-[0.99]"
            style={{
              border: '3px solid var(--color-ink)',
              borderRadius: '22px',
              boxShadow: '6px 6px 0 var(--color-shadow-green)',
            }}
          >
            <div
              onClick={() => toggleSection('history')}
              className="flex items-center gap-3 p-4 cursor-pointer"
            >
              <div
                className="w-12 h-12 flex items-center justify-center text-2xl rounded-xl"
                style={{ background: '#EAF3FF' }}
              >
                📖
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">浏览记录</div>
                <div className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
                  最近浏览过的菜品
                </div>
              </div>
              <div
                className="w-7 h-7 flex items-center justify-center rounded-full"
                style={{
                  background: 'var(--color-ink)',
                  transform: expandedSection === 'history' ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <span className="text-white text-xs font-bold">›</span>
              </div>
            </div>

            {/* Expanded history content */}
            {expandedSection === 'history' && (
              <div className="px-4 pb-4 pt-1">
                {historyDishes.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {historyDishes.map((dish) => (
                      <div
                        key={dish.id}
                        onClick={() => navigate(`/dishes/${dish.id}`)}
                        className="flex items-center gap-3 p-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.99]"
                        style={{
                          border: '3px solid var(--color-ink)',
                          borderRadius: '20px',
                          boxShadow: '5px 5px 0 var(--color-shadow-green)',
                        }}
                      >
                        <span className="text-2xl">🍽️</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{dish.name}</div>
                          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                            ⭐ {dish.rating.toFixed(1)} · ¥{dish.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-xs text-center py-4"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    还没有浏览记录
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Reviews menu item */}
          <div
            className="bg-white overflow-hidden transition-transform duration-150 active:scale-[0.99]"
            style={{
              border: '3px solid var(--color-ink)',
              borderRadius: '22px',
              boxShadow: '6px 6px 0 var(--color-shadow-amber)',
            }}
          >
            <div
              onClick={() => toggleSection('reviews')}
              className="flex items-center gap-3 p-4 cursor-pointer"
            >
              <div
                className="w-12 h-12 flex items-center justify-center text-2xl rounded-xl"
                style={{ background: '#EAF7F0' }}
              >
                ✍️
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">我的评价</div>
                <div className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
                  发表过的所有评价
                </div>
              </div>
              <div
                className="w-7 h-7 flex items-center justify-center rounded-full"
                style={{
                  background: 'var(--color-ink)',
                  transform: expandedSection === 'reviews' ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <span className="text-white text-xs font-bold">›</span>
              </div>
            </div>

            {/* Expanded reviews content */}
            {expandedSection === 'reviews' && (
              <div className="px-4 pb-4 pt-1">
                {reviewsLoading ? (
                  <p
                    className="text-xs text-center py-4"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    加载中...
                  </p>
                ) : myReviews.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {myReviews.map((review) => (
                      <div
                        key={review.id}
                        onClick={() => navigate(`/dishes/${review.dishId}`)}
                        className="p-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.99]"
                        style={{
                          border: '3px solid var(--color-ink)',
                          borderRadius: '20px',
                          boxShadow: '5px 5px 0 var(--color-shadow-amber)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm">{review.dishName}</span>
                          <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                            {formatRelativeTime(review.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className="text-xs">
                              {i < review.rating ? '⭐' : '☆'}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs" style={{ color: 'var(--color-muted-dark)' }}>
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-xs text-center py-4"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    还没有评价，快去分享你的美食体验吧
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {myReviews.length === 0 && favoriteDishes.length === 0 && historyDishes.length === 0 && !reviewsLoading && (
        <div className="px-4 mt-4">
          <div
            className="text-center py-6 text-sm bg-white"
            style={{
              border: '3px solid var(--color-ink)',
              borderRadius: '22px',
              boxShadow: '6px 6px 0 var(--color-shadow-amber)',
              color: 'var(--color-muted)',
            }}
          >
            还没有记录，快去探索美食吧 🍜
          </div>
        </div>
      )}

      {/* Logout button */}
      <div className="px-4 mt-6 pb-4">
        <button
          onClick={handleLogout}
          className="w-full py-3 text-sm font-bold cursor-pointer transition-transform duration-150 active:scale-[0.98]"
          style={{
            background: 'white',
            color: 'var(--color-ink)',
            border: '3px solid var(--color-ink)',
            borderRadius: '22px',
            boxShadow: '6px 6px 0 var(--color-shadow-amber)',
          }}
        >
          退出登录
        </button>
      </div>
    </div>
  )
}
