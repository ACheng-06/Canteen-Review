import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useFavoriteStore } from '../stores/useFavoriteStore'
import { useHistoryStore } from '../stores/useHistoryStore'
import { getCategoryVisual } from '../utils/categoryVisual'
import { getMyReviews, deleteReview } from '../api/auth'
import { getDishById } from '../api/dishes'
import { formatRelativeTime } from '../utils/format'
import type { Dish } from '../types'

type ExpandedSection = null | 'favorites' | 'history' | 'reviews'

const avatarOptions = ['😊', '😎', '🤗', '😋', '🧑‍🍳', '👨‍🍳', '🐷', '🐱', '🦊', '🐻', '🍕', '🍔', '🍜', '🍰', '🧋', '🔥']

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
  const { user, logout, fetchMe, isLoading: authLoading, token, updateProfile } = useAuthStore()
  const { favoriteDishIds } = useFavoriteStore()
  const { historyDishIds, removeHistory } = useHistoryStore()
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null)
  const [editing, setEditing] = useState(false)
  const [editNickname, setEditNickname] = useState('')
  const [editAvatar, setEditAvatar] = useState('')
  const [editBio, setEditBio] = useState('')
  const [saving, setSaving] = useState(false)
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
    if (window.confirm('确定要退出登录吗？')) {
      logout()
      navigate('/', { replace: true })
    }
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
        className="relative px-6 pb-20 overflow-hidden"
        style={{
          background: 'var(--color-ink)',
          borderBottom: '5px solid var(--color-ink)',
          paddingTop: 'max(64px, calc(env(safe-area-inset-top, 0px) + 16px))',
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
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-lg">{user.nickname}</h2>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              {user.bio}
            </p>
          </div>
          <button
            onClick={() => {
              setEditNickname(user.nickname)
              setEditAvatar(user.avatar)
              setEditBio(user.bio)
              setEditing(true)
            }}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-transform duration-150 active:scale-[0.9]"
            style={{
              background: 'var(--color-bg)',
              border: '2px solid var(--color-ink)',
            }}
          >
            <span className="text-sm">✏️</span>
          </button>
        </div>

        {/* Edit modal */}
        {editing && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center px-6"
            onClick={() => setEditing(false)}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <div
              className="relative w-full max-w-[360px] p-5 bg-white"
              style={{
                border: '3px solid var(--color-ink)',
                borderRadius: '24px',
                boxShadow: '10px 10px 0 var(--color-shadow-blue)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-black text-base mb-4">编辑资料</h3>

              {/* Avatar picker */}
              <div className="mb-3">
                <label className="text-xs font-bold block mb-2">头像</label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setEditAvatar(emoji)}
                      className="w-10 h-10 flex items-center justify-center text-xl rounded-full transition-transform duration-150 active:scale-[0.9]"
                      style={{
                        background: editAvatar === emoji ? 'var(--color-soft-amber)' : 'var(--color-bg)',
                        border: editAvatar === emoji ? '3px solid var(--color-ink)' : '2px solid var(--color-line)',
                        borderRadius: '50%',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nickname */}
              <div className="mb-3">
                <label className="text-xs font-bold block mb-1">昵称</label>
                <input
                  type="text"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value.slice(0, 20))}
                  maxLength={20}
                  className="w-full px-3 py-2 text-sm outline-none"
                  style={{
                    background: 'var(--color-bg)',
                    border: '3px solid var(--color-ink)',
                    borderRadius: '14px',
                  }}
                />
                <span className="text-[10px] mt-0.5 block text-right" style={{ color: 'var(--color-muted)' }}>
                  {editNickname.length}/20
                </span>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <label className="text-xs font-bold block mb-1">简介</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value.slice(0, 100))}
                  maxLength={100}
                  rows={2}
                  className="w-full px-3 py-2 text-sm outline-none resize-none"
                  style={{
                    background: 'var(--color-bg)',
                    border: '3px solid var(--color-ink)',
                    borderRadius: '14px',
                  }}
                />
                <span className="text-[10px] mt-0.5 block text-right" style={{ color: 'var(--color-muted)' }}>
                  {editBio.length}/100
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 text-sm font-bold transition-transform duration-150 active:scale-[0.97]"
                  style={{
                    background: 'white',
                    border: '3px solid var(--color-ink)',
                    borderRadius: '14px',
                    boxShadow: '3px 3px 0 var(--color-shadow-blue)',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={async () => {
                    setSaving(true)
                    try {
                      await updateProfile({
                        nickname: editNickname,
                        avatar: editAvatar,
                        bio: editBio,
                      })
                      setEditing(false)
                    } catch {
                      alert('保存失败，请重试')
                    } finally {
                      setSaving(false)
                    }
                  }}
                  disabled={saving || !editNickname.trim()}
                  className="flex-1 py-2.5 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
                  style={{
                    background: 'var(--color-ink)',
                    border: '3px solid var(--color-ink)',
                    borderRadius: '14px',
                    boxShadow: '3px 3px 0 var(--color-shadow-blue)',
                  }}
                >
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </div>
        )}

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
            { emoji: '💬', label: '意见反馈', bg: '#EAF7F0', action: 'feedback' as const },
            { emoji: '❤️', label: '暂未开放', bg: '#FFF0F0', action: null },
            { emoji: '📖', label: '暂未开放', bg: '#EAF3FF', action: null },
            { emoji: '📝', label: '暂未开放', bg: '#FFF6E0', action: null },
          ].map((item) => (
            <div
              key={item.label + item.action}
              className="flex flex-col items-center gap-2 py-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.97]"
              style={{
                border: '3px solid var(--color-ink)',
                borderRadius: '22px',
                boxShadow: '6px 6px 0 var(--color-shadow-amber)',
              }}
              onClick={() => {
                if (item.action === 'feedback') {
                  alert('意见反馈请联系 QQ：2011024577')
                } else {
                  alert('该功能暂未开放，敬请期待')
                }
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
            className="bg-white overflow-hidden transition-transform duration-150 active:scale-[0.98]"
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
                        className="flex items-center gap-3 p-3 bg-white cursor-pointer"
                        style={{
                          border: '3px solid var(--color-ink)',
                          borderRadius: '20px',
                          boxShadow: '5px 5px 0 var(--color-shadow-blue)',
                          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
                        }}
                        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; e.currentTarget.style.boxShadow = '2px 2px 0 var(--color-shadow-blue)' }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '5px 5px 0 var(--color-shadow-blue)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '5px 5px 0 var(--color-shadow-blue)' }}
                        onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; e.currentTarget.style.boxShadow = '2px 2px 0 var(--color-shadow-blue)' }}
                        onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '5px 5px 0 var(--color-shadow-blue)' }}
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0" style={{ background: getCategoryVisual(dish.category).bg, borderRadius: '12px', border: '2px solid var(--color-ink)' }}>{getCategoryVisual(dish.category).emoji}</div>
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
            className="bg-white overflow-hidden transition-transform duration-150 active:scale-[0.98]"
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
                        className="flex items-center gap-3 p-3 bg-white cursor-pointer"
                        style={{
                          border: '3px solid var(--color-ink)',
                          borderRadius: '20px',
                          boxShadow: '5px 5px 0 var(--color-shadow-green)',
                          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
                        }}
                        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; e.currentTarget.style.boxShadow = '2px 2px 0 var(--color-shadow-green)' }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '5px 5px 0 var(--color-shadow-green)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '5px 5px 0 var(--color-shadow-green)' }}
                        onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; e.currentTarget.style.boxShadow = '2px 2px 0 var(--color-shadow-green)' }}
                        onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '5px 5px 0 var(--color-shadow-green)' }}
                      >
                        <div className="w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0" style={{ background: getCategoryVisual(dish.category).bg, borderRadius: '12px', border: '2px solid var(--color-ink)' }}>{getCategoryVisual(dish.category).emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{dish.name}</div>
                          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                            ⭐ {dish.rating.toFixed(1)} · ¥{dish.price}
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeHistory(dish.id) }}
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-transform duration-150 active:scale-[0.9]"
                          style={{ background: '#FFF0F0', border: '2px solid var(--color-red)' }}
                        >
                          <span className="text-sm">❌</span>
                        </button>
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
            className="bg-white overflow-hidden transition-transform duration-150 active:scale-[0.98]"
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
                        className="p-3 bg-white cursor-pointer"
                        style={{
                          border: '3px solid var(--color-ink)',
                          borderRadius: '20px',
                          boxShadow: '5px 5px 0 var(--color-shadow-amber)',
                          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
                        }}
                        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; e.currentTarget.style.boxShadow = '2px 2px 0 var(--color-shadow-amber)' }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '5px 5px 0 var(--color-shadow-amber)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '5px 5px 0 var(--color-shadow-amber)' }}
                        onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; e.currentTarget.style.boxShadow = '2px 2px 0 var(--color-shadow-amber)' }}
                        onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '5px 5px 0 var(--color-shadow-amber)' }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm cursor-pointer" onClick={() => navigate(`/dishes/${review.dishId}`)}>{review.dishName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                              {formatRelativeTime(review.createdAt)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (window.confirm('确定要删除这条评价吗？')) {
                                  deleteReview(review.id).then(() => {
                                    setMyReviews((prev) => prev.filter((r) => r.id !== review.id))
                                  })
                                }
                              }}
                              className="w-6 h-6 flex items-center justify-center rounded-full transition-transform duration-150 active:scale-[0.9]"
                              style={{ background: '#FFF0F0', border: '1.5px solid var(--color-red)' }}
                            >
                              <span className="text-[10px]">❌</span>
                            </button>
                          </div>
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
