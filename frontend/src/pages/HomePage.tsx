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
]

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all'>('all')

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

  const totalWindows = canteens.reduce((sum, c) => sum + c.windowCount, 0)
  const totalReviews = dishes.reduce((sum, d) => sum + d.reviewCount, 0)

  return (
    <div
      className="px-4 pb-[200px]"
      style={{ background: 'linear-gradient(var(--color-bg-warm), var(--color-bg))' }}
    >
      {/* Hero */}
      <div
        className="relative mt-4 p-5 overflow-hidden"
        style={{
          background: 'linear-gradient(white, var(--color-paper))',
          border: '3px solid var(--color-ink)',
          borderRadius: '28px',
          boxShadow: '10px 10px 0 var(--color-shadow-blue)',
        }}
      >
        <h1 className="text-shadow-pop font-black text-2xl leading-tight">
          校园食堂点评
        </h1>
        <p className="text-xs mt-1" style={{ color: '#6B4E16' }}>
          发现你最爱的校园美食 🍜
        </p>

        {/* Search */}
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
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-muted)]"
          />
        </div>
      </div>

      {/* Stats */}
      <div
        className="flex items-center justify-around mt-4 py-3 px-4"
        style={{
          border: '3px solid var(--color-ink)',
          borderRadius: '20px',
          background: 'white',
          boxShadow: '6px 6px 0 var(--color-shadow-amber)',
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

      {/* Category Grid */}
      <div className="mt-5">
        <h2 className="text-shadow-pop-soft text-lg font-black mb-3">菜品分类</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
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

      {/* All dishes / filtered */}
      <div className="mt-6">
        <h2 className="text-shadow-pop-soft text-lg font-black mb-3">
          {selectedCategory === 'all' ? '全部菜品' : selectedCategory}
        </h2>
        <div className="flex flex-col gap-3">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
          {filteredDishes.length === 0 && (
            <div
              className="text-center py-8 text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              没有找到匹配的菜品 😅
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
