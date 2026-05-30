import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { canteens, dishes } from '../mock'
import DishCard from '../components/DishCard'
import type { DishCategory } from '../types'

const categories: { label: string; emoji: string; value: DishCategory | 'all' }[] = [
  { label: '全部', emoji: '🍽️', value: 'all' },
  { label: '热菜', emoji: '🥘', value: '热菜' },
  { label: '凉菜', emoji: '🥗', value: '凉菜' },
  { label: '面食', emoji: '🍜', value: '面食' },
  { label: '小吃', emoji: '🍡', value: '小吃' },
  { label: '水果', emoji: '🍎', value: '水果' },
  { label: '饮品', emoji: '🧋', value: '饮品' },
  { label: '甜品', emoji: '🍰', value: '甜品' },
]

// 主行显示的标签（前3个热度高的）
const mainTags = [
  { label: '饭点推荐', hot: true },
  { label: '15元内', hot: false },
  { label: '出餐快', hot: false },
]

// 弹窗里的标签（剩余的 + 更多）
const popupTags = [
  '好评如潮', '清淡饮食', '量大管饱', '新品上架', '同学推荐', '下饭神器', '适合拍照',
]

const PAGE_SIZE = 5

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all'>('all')
  const [page, setPage] = useState(1)
  const [showTagPopup, setShowTagPopup] = useState(false)

  const recommended = useMemo(
    () => [...dishes].sort((a, b) => b.popularity - a.popularity).slice(0, 6),
    [],
  )

  const filteredDishes = useMemo(() => {
    let result = dishes
    if (selectedCategory !== 'all') {
      result = result.filter((d) => d.category === selectedCategory)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (d) => d.name.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q)),
      )
    }
    return result
  }, [search, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filteredDishes.length / PAGE_SIZE))
  const paginatedDishes = filteredDishes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalWindows = canteens.reduce((sum, c) => sum + c.windowCount, 0)
  const totalReviews = dishes.reduce((sum, d) => sum + d.reviewCount, 0)

  const updateSearch = (nextSearch: string) => {
    setSearch((current) => {
      if (current !== nextSearch) {
        setPage(1)
      }
      return nextSearch
    })
  }

  const updateCategory = (nextCategory: DishCategory | 'all') => {
    setSelectedCategory((current) => {
      if (current !== nextCategory) {
        setPage(1)
      }
      return nextCategory
    })
  }

  return (
    <div className="px-4" style={{ background: 'var(--color-paper)' }}>
      {/* Hero card */}
      <div
        className="relative mt-4 p-5 overflow-hidden"
        style={{
          background: 'white',
          border: '3px solid var(--color-ink)',
          borderRadius: '28px',
          boxShadow: '10px 10px 0 var(--color-shadow-blue)',
        }}
      >
        {/* Top section: left = greeting, right = decorative area */}
        <div className="flex items-start justify-between gap-2">
          {/* Left: greeting + title */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: '#6B4E16' }}>
              校园干饭时间 🍳
            </p>
            <h1 className="text-shadow-pop font-black text-2xl leading-tight mt-0.5">
              今天想吃点什么？
            </h1>
          </div>

          {/* Right: decorative area (card B) */}
          <div
            className="relative flex-shrink-0"
            style={{ width: 100, height: 72 }}
          >
            {/* TOP榜 - B's top-left */}
            <div
              className="absolute top-0 left-0 px-2 py-0.5 text-[10px] font-black"
              style={{
                background: 'var(--color-amber)',
                color: 'var(--color-ink)',
                borderRadius: '8px',
                border: '2px solid var(--color-ink)',
                transform: 'rotate(-6deg)',
                boxShadow: '2px 2px 0 var(--color-ink)',
              }}
            >
              TOP榜
            </div>

            {/* WOW! - B's top-right */}
            <div
              className="absolute top-0 right-0 flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                background: 'var(--color-pink)',
                borderRadius: '50%',
                border: '3px solid var(--color-ink)',
                transform: 'rotate(15deg)',
                boxShadow: '2px 2px 0 var(--color-ink)',
              }}
            >
              <span className="text-[11px] font-black text-white">WOW!</span>
            </div>

            {/* CAMPUS FOOD - B's bottom-right */}
            <div
              className="absolute bottom-0 right-0 px-2 py-0.5 text-[8px] font-black"
              style={{
                background: 'var(--color-cyan)',
                color: 'var(--color-ink)',
                borderRadius: '6px',
                border: '2px solid var(--color-ink)',
                transform: 'rotate(3deg)',
                boxShadow: '2px 2px 0 var(--color-ink)',
              }}
            >
              CAMPUS FOOD
            </div>
          </div>
        </div>

        {/* Search input */}
        <div
          className="mt-4 flex items-center gap-2 px-3 py-2"
          style={{
            background: 'var(--color-bg)',
            border: '3px solid var(--color-ink)',
            borderRadius: '20px',
          }}
        >
          <span>🔍</span>
          <input
            type="text"
            placeholder="搜索菜品、食堂..."
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-muted)]"
          />
        </div>

        {/* Quick filter tags - all 4 on one line + ... */}
        <div className="flex gap-2 mt-3 items-center">
          {mainTags.map((tag) => (
            <button
              key={tag.label}
              onClick={() => updateSearch(tag.label)}
              className="px-3 py-1 text-xs font-bold transition-transform duration-150 active:scale-[0.97] whitespace-nowrap"
              style={{
                background: search === tag.label ? 'var(--color-ink)' : 'white',
                color: search === tag.label ? 'white' : 'var(--color-ink)',
                border: '2px solid var(--color-ink)',
                borderRadius: '14px',
                boxShadow: '3px 3px 0 var(--color-shadow-blue)',
              }}
            >
              {tag.hot && (
                <span
                  className="inline-block mr-1 text-[9px] font-black px-1 rounded-sm"
                  style={{ background: '#FF4D4F', color: 'white' }}
                >
                  HOT
                </span>
              )}
              {tag.label}
            </button>
          ))}
          <button
            onClick={() => setShowTagPopup(true)}
            className="px-3 py-1 text-xs font-bold transition-transform duration-150 active:scale-[0.97] whitespace-nowrap"
            style={{
              background: 'white',
              color: 'var(--color-muted)',
              border: '2px solid var(--color-line)',
              borderRadius: '14px',
            }}
          >
            ···
          </button>
        </div>

        {/* Tag popup overlay */}
        {showTagPopup && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center"
            onClick={() => setShowTagPopup(false)}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            />
            <div
              className="relative w-full max-w-[390px] mx-4 mb-4 p-5"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                border: '3px solid var(--color-ink)',
                borderRadius: '24px',
                boxShadow: '10px 10px 0 var(--color-shadow-blue)',
              }}
            >
              <h3 className="font-black text-base mb-3">更多标签</h3>
              <div className="flex flex-wrap gap-2">
                {popupTags.map((label) => (
                  <button
                    key={label}
                    onClick={() => {
                      updateSearch(label)
                      setShowTagPopup(false)
                    }}
                    className="px-3 py-1.5 text-xs font-bold transition-transform duration-150 active:scale-[0.97]"
                    style={{
                      background: search === label ? 'var(--color-ink)' : 'var(--color-bg)',
                      color: search === label ? 'white' : 'var(--color-ink)',
                      border: '2px solid var(--color-ink)',
                      borderRadius: '14px',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats panel */}
        <div
          className="flex items-center justify-around mt-4 py-3 px-2"
          style={{
            border: '3px solid var(--color-ink)',
            borderRadius: '20px',
            background: 'white',
          }}
        >
          <div className="text-center">
            <div className="text-xl font-black" style={{ color: 'var(--color-blue)' }}>
              {canteens.length}
            </div>
            <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
              食堂
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black" style={{ color: 'var(--color-blue)' }}>
              {totalWindows}
            </div>
            <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
              窗口
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black" style={{ color: 'var(--color-blue)' }}>
              {totalReviews}
            </div>
            <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
              评价
            </div>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="mt-5">
        <h2 className="text-shadow-pop-soft text-lg font-black mb-3">菜品分类</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => updateCategory(cat.value)}
              className="flex flex-col items-center gap-1 py-3 transition-transform duration-150 active:scale-[0.97]"
              style={{
                background:
                  selectedCategory === cat.value ? 'var(--color-soft-amber)' : 'white',
                border: '3px solid var(--color-ink)',
                borderRadius: '20px',
                boxShadow:
                  selectedCategory === cat.value
                    ? '5px 5px 0 var(--color-amber)'
                    : '5px 5px 0 var(--color-shadow-blue)',
              }}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-[11px] font-bold">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className="mt-6">
        <h2 className="text-shadow-pop-soft text-lg font-black mb-3">🔥 热门推荐</h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {recommended.map((dish) => (
            <div
              key={dish.id}
              onClick={() => navigate(`/dishes/${dish.id}`)}
              className="flex-shrink-0 w-[140px] p-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.99]"
              style={{
                border: '3px solid var(--color-ink)',
                borderRadius: '22px',
                boxShadow: '7px 7px 0 var(--color-shadow-blue)',
              }}
            >
              <div
                className="w-full h-20 flex items-center justify-center text-3xl mb-2"
                style={{
                  background: 'var(--color-soft-amber)',
                  borderRadius: '16px',
                  border: '2px solid var(--color-ink)',
                }}
              >
                🍽️
              </div>
              <div className="font-black text-sm truncate">{dish.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                ⭐ {dish.rating.toFixed(1)} · ¥{dish.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All dishes / filtered with pagination */}
      <div className="mt-6">
        <h2 className="text-shadow-pop-soft text-lg font-black mb-3">
          {selectedCategory === 'all' ? '全部菜品' : selectedCategory}
        </h2>
        <div className="flex flex-col gap-3">
          {paginatedDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
          {filteredDishes.length === 0 && (
            <div
              className="text-center py-8 text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              没有找到匹配的菜品
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-black transition-transform duration-150 active:scale-[0.97] disabled:opacity-40"
              style={{
                background: 'var(--color-ink)',
                color: 'white',
                border: '3px solid var(--color-ink)',
                borderRadius: '14px',
                boxShadow: '4px 4px 0 var(--color-shadow-blue)',
              }}
            >
              上一页
            </button>
            <span className="text-sm font-bold" style={{ color: 'var(--color-muted)' }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-black transition-transform duration-150 active:scale-[0.97] disabled:opacity-40"
              style={{
                background: 'var(--color-ink)',
                color: 'white',
                border: '3px solid var(--color-ink)',
                borderRadius: '14px',
                boxShadow: '4px 4px 0 var(--color-shadow-blue)',
              }}
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
