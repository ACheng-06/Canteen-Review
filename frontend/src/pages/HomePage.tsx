import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCanteens } from '../api/canteens'
import { getDishes } from '../api/dishes'
import DishCard from '../components/DishCard'
import { useAuthStore } from '../stores/useAuthStore'
import { getCategoryVisual } from '../utils/categoryVisual'
import type { DishCategory } from '../types'

const categories: { label: string; emoji: string; value: DishCategory | 'all' }[] = [
  { label: '全部', emoji: '🍽️', value: 'all' },
  { label: '热菜', emoji: '🍲', value: '热菜' },
  { label: '粉面', emoji: '🍜', value: '粉面' },
  { label: '面食', emoji: '🌾', value: '面食' },
  { label: '小吃', emoji: '🍢', value: '小吃' },
  { label: '水果', emoji: '🍉', value: '水果' },
  { label: '饮品', emoji: '🧋', value: '饮品' },
  { label: '甜品', emoji: '🍰', value: '甜品' },
]

const announcements = [
  '📢 欢迎使用「华航小助手APP」！感谢你成为我们的首批用户，你的每一次评价都在让我们变得更好！',
  '🎉 目前仍在持续完善中，部分功能可能存在不足，感谢你的理解与包容。',
  '⏰ 💬 遇到问题或有好的建议？欢迎随时反馈，我们会认真对待每一条意见。',
]

const hotSearches = ['麻辣烫', '黄焖鸡', '奶茶', '炒饭', '拉面', '炸鸡']

function getGreeting(): { emoji: string; text: string } {
  const h = new Date().getHours()
  if (h >= 6 && h < 10) return { emoji: '☀️', text: '早上好' }
  if (h >= 10 && h < 14) return { emoji: '🌤️', text: '中午好' }
  if (h >= 14 && h < 17) return { emoji: '🌅', text: '下午好' }
  if (h >= 17 && h < 22) return { emoji: '🌙', text: '晚上好' }
  return { emoji: '🦉', text: '夜猫子出没' }
}

const STORAGE_KEY = 'canteen_recent_searches'
const MAX_RECENT = 8
const PAGE_SIZE = 5
const PULL_THRESHOLD = 60

function loadRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveRecent(q: string) {
  const list = loadRecent().filter((s) => s !== q)
  list.unshift(q)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_RECENT)))
}
function clearRecent() { localStorage.removeItem(STORAGE_KEY) }

const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all'>('all')
  const [page, setPage] = useState(1)
  const [canteens, setCanteens] = useState<any[]>([])
  const [allDishes, setAllDishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [searchFocused, setSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecent)
  const searchRef = useRef<HTMLDivElement>(null)

  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const pullContainerRef = useRef<HTMLDivElement>(null)
  const pullRef = useRef({ startY: 0, pulling: false, refreshing: false, dist: 0 })

  const fetchData = async () => {
    try {
      const [c, d] = await Promise.all([getCanteens(), getDishes({ limit: 200 })])
      setCanteens(c)
      setAllDishes(d.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  useEffect(() => {
    const fn = () => { if (searchFocused) setSearchFocused(false) }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [searchFocused])

  useEffect(() => {
    const el = pullContainerRef.current
    if (!el) return
    const onStart = (e: TouchEvent) => {
      if (window.scrollY > 0 || pullRef.current.refreshing) return
      pullRef.current.startY = e.touches[0].clientY
      pullRef.current.pulling = false
    }
    const onMove = (e: TouchEvent) => {
      if (window.scrollY > 0 || pullRef.current.refreshing) return
      const diff = e.touches[0].clientY - pullRef.current.startY
      if (diff > 0) {
        pullRef.current.pulling = true
        e.preventDefault()
        const d = Math.min(diff * 0.5, 100)
        pullRef.current.dist = d
        setPullDistance(d)
      }
    }
    const onEnd = () => {
      if (!pullRef.current.pulling) return
      if (pullRef.current.dist >= PULL_THRESHOLD) {
        pullRef.current.refreshing = true
        setIsRefreshing(true)
        setPullDistance(40)
        fetchData().then(() => {
          pullRef.current.refreshing = false
          pullRef.current.dist = 0
          setIsRefreshing(false)
          setPullDistance(0)
        })
      } else {
        pullRef.current.dist = 0
        setPullDistance(0)
      }
      pullRef.current.pulling = false
    }
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [])

  const executeSearch = (q: string) => {
    setSearch(q); setPage(1); setSearchFocused(false)
    if (q.trim()) { saveRecent(q.trim()); setRecentSearches(loadRecent()) }
  }
  const clearSearch = () => { setSearch(''); setSelectedCategory('all'); setPage(1) }

  const recommended = useMemo(() => [...allDishes].sort((a, b) => b.popularity - a.popularity).slice(0, 6), [allDishes])
  const filteredDishes = useMemo(() => {
    let r = allDishes
    if (selectedCategory !== 'all') r = r.filter((d) => d.category === selectedCategory)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      r = r.filter((d) => d.name.toLowerCase().includes(q) || d.tags.some((t: string) => t.includes(q)))
    }
    return r
  }, [allDishes, search, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filteredDishes.length / PAGE_SIZE))
  const paginatedDishes = filteredDishes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalWindows = canteens.reduce((s, c) => s + c.windowCount, 0)
  const totalReviews = allDishes.reduce((s: number, d: any) => s + d.reviewCount, 0)
  const hasActiveSearch = search.trim() !== '' || selectedCategory !== 'all'
  const showSearchPanel = searchFocused && (recentSearches.length > 0 || hotSearches.length > 0)
  const greeting = getGreeting()

  const pressDown = (el: HTMLElement, shadow = 'var(--color-shadow-blue)') => {
    el.style.transform = 'scale(0.95)'
    el.style.boxShadow = `3px 3px 0 ${shadow}`
  }
  const pressUp = (el: HTMLElement, shadow = 'var(--color-shadow-blue)') => {
    el.style.transform = 'scale(1)'
    el.style.boxShadow = `7px 7px 0 ${shadow}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" style={{ background: 'var(--color-paper)' }}>
        <div className="text-lg font-black" style={{ color: 'var(--color-muted)' }}>加载中...</div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--color-paper)' }}>

      {/* 安全区域 */}
      <div className="safe-area-top" />

      {/* 公告跑马灯 */}
      <div className="px-4">
        <div
          className="flex items-center overflow-hidden"
          style={{ border: '3px solid var(--color-ink)', borderRadius: '16px', background: 'var(--color-soft-amber)', height: 36 }}
        >
          <div
            className="flex-shrink-0 px-2 h-full flex items-center text-[10px] font-black"
            style={{ background: 'var(--color-amber)', borderRight: '2px solid var(--color-ink)', color: 'var(--color-ink)' }}
          >
            📢 公告
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div
              className="flex items-center whitespace-nowrap"
              style={{ animation: 'marquee 20s linear infinite', width: 'max-content' }}
            >
              {[...announcements, ...announcements].map((text, i) => (
                <span key={i} className="text-xs font-bold px-6" style={{ color: 'var(--color-ink)' }}>{text}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 mt-3">
        <div
          className="relative p-5 overflow-visible"
          style={{
            background: 'white',
            border: '3px solid var(--color-ink)',
            borderRadius: '28px',
            boxShadow: '10px 10px 0 var(--color-shadow-blue)',
            zIndex: showSearchPanel ? 20 : 'auto',
          }}
        >
          {/* 问候 + 装饰 */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold" style={{ color: '#6B4E16' }}>
                {greeting.emoji} {greeting.text}：{user ? user.nickname : '同学'}
              </p>
              <h1 className="text-shadow-pop font-black text-2xl leading-tight mt-0.5">今天想吃点什么？</h1>
            </div>
            <div className="relative flex-shrink-0" style={{ width: 100, height: 72 }}>
              <div className="absolute top-0 left-0 px-2 py-0.5 text-[10px] font-black" style={{ background: 'var(--color-amber)', color: 'var(--color-ink)', borderRadius: '8px', border: '2px solid var(--color-ink)', transform: 'rotate(-6deg)', boxShadow: '2px 2px 0 var(--color-ink)' }}>TOP榜</div>
              <div className="absolute top-0 right-0 flex items-center justify-center" style={{ width: 44, height: 44, background: 'var(--color-pink)', borderRadius: '50%', border: '3px solid var(--color-ink)', transform: 'rotate(15deg)', boxShadow: '2px 2px 0 var(--color-ink)' }}>
                <span className="text-[11px] font-black text-white">WOW!</span>
              </div>
              <div className="absolute bottom-0 right-0 px-2 py-0.5 text-[8px] font-black" style={{ background: 'var(--color-cyan)', color: 'var(--color-ink)', borderRadius: '6px', border: '2px solid var(--color-ink)', transform: 'rotate(3deg)', boxShadow: '2px 2px 0 var(--color-ink)' }}>CAMPUS FOOD</div>
            </div>
          </div>

          {/* 搜索框 */}
          <div ref={searchRef} className="relative mt-4">
            <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'var(--color-bg)', border: '3px solid var(--color-ink)', borderRadius: '20px' }}>
              <span>🔍</span>
              <input
                type="text"
                placeholder="搜索菜品、食堂..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                onFocus={() => setSearchFocused(true)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-muted)]"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-xs font-bold px-1" style={{ color: 'var(--color-muted)' }}>✕</button>
              )}
            </div>

            {/* 搜索下拉 */}
            {showSearchPanel && (
              <div
                className="absolute left-0 right-0 mt-2 p-4"
                style={{ background: 'white', border: '3px solid var(--color-ink)', borderRadius: '20px', boxShadow: '7px 7px 0 var(--color-shadow-blue)', zIndex: 50 }}
              >
                {recentSearches.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black" style={{ color: 'var(--color-ink)' }}>最近搜索</span>
                      <button onMouseDown={(e) => { e.preventDefault(); clearRecent(); setRecentSearches([]) }} className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>清空</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((item) => (
                        <button key={item} onMouseDown={(e) => { e.preventDefault(); executeSearch(item) }} className="px-3 py-1 text-xs font-bold" style={{ background: 'var(--color-bg)', color: 'var(--color-ink)', border: '2px solid var(--color-ink)', borderRadius: '14px' }}>{item}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-xs font-black mb-2 block" style={{ color: 'var(--color-ink)' }}>🔥 热门搜索</span>
                  <div className="flex flex-wrap gap-2">
                    {hotSearches.map((item) => (
                      <button key={item} onMouseDown={(e) => { e.preventDefault(); executeSearch(item) }} className="px-3 py-1 text-xs font-bold" style={{ background: 'var(--color-soft-amber)', color: 'var(--color-ink)', border: '2px solid var(--color-ink)', borderRadius: '14px' }}>{item}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 统计 */}
          <div className="flex items-center justify-around mt-4 py-3 px-2" style={{ border: '3px solid var(--color-ink)', borderRadius: '20px', background: 'white' }}>
            <div className="text-center"><div className="text-xl font-black" style={{ color: 'var(--color-blue)' }}>{canteens.length}</div><div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>食堂</div></div>
            <div className="text-center"><div className="text-xl font-black" style={{ color: 'var(--color-blue)' }}>{totalWindows}</div><div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>窗口</div></div>
            <div className="text-center"><div className="text-xl font-black" style={{ color: 'var(--color-blue)' }}>{totalReviews}</div><div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>评价</div></div>
          </div>
        </div>
      </div>

      {/* 分类 */}
      <div className="px-4 mt-5">
        <h2 className="text-shadow-pop-soft text-lg font-black mb-3">菜品分类</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setSelectedCategory(cat.value); setPage(1) }}
              className="flex flex-col items-center gap-1 py-3 transition-transform duration-150 active:scale-[0.95]"
              style={{
                background: selectedCategory === cat.value ? 'var(--color-soft-amber)' : 'white',
                border: '3px solid var(--color-ink)',
                borderRadius: '20px',
                boxShadow: selectedCategory === cat.value ? '5px 5px 0 var(--color-amber)' : '5px 5px 0 var(--color-shadow-blue)',
              }}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-[11px] font-bold">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 热门推荐 */}
      <div className="px-4 mt-6">
        <h2 className="text-shadow-pop-soft text-lg font-black mb-3">🔥 热门推荐</h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {recommended.map((dish) => {
            const v = getCategoryVisual(dish.category)
            return (
            <div
              key={dish.id}
              onClick={() => navigate(`/dishes/${dish.id}`)}
              className="flex-shrink-0 w-[140px] p-3 bg-white cursor-pointer"
              style={{ border: '3px solid var(--color-ink)', borderRadius: '22px', boxShadow: '7px 7px 0 var(--color-shadow-blue)', transition: `transform 0.2s ${spring}, box-shadow 0.2s ease` }}
              onMouseDown={(e) => pressDown(e.currentTarget)}
              onMouseUp={(e) => pressUp(e.currentTarget)}
              onMouseLeave={(e) => pressUp(e.currentTarget)}
              onTouchStart={(e) => pressDown(e.currentTarget)}
              onTouchEnd={(e) => pressUp(e.currentTarget)}
            >
              <div className="w-full h-20 flex items-center justify-center text-4xl mb-2" style={{ background: v.bg, borderRadius: '16px', border: '2px solid var(--color-ink)' }}>{v.emoji}</div>
              <div className="font-black text-sm truncate">{dish.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>⭐ {dish.rating.toFixed(1)} · ¥{dish.price}</div>
            </div>
            )
          })}
        </div>
      </div>

      {/* 全部菜品 */}
      <div className="px-4 mt-6 pb-4">
        <h2 className="text-shadow-pop-soft text-lg font-black mb-3">
          {selectedCategory === 'all' ? '全部菜品' : selectedCategory}
        </h2>

        <div ref={pullContainerRef} style={{ position: 'relative' }}>
          {/* 下拉刷新指示器 */}
          <div style={{ position: 'absolute', top: -40, left: 0, right: 0, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: pullDistance > 0 ? 1 : 0, transform: `translateY(${pullDistance}px)`, transition: isRefreshing ? 'transform 0.2s ease' : 'none', pointerEvents: 'none' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--color-muted)' }}>
              {isRefreshing ? '刷新中...' : pullDistance >= PULL_THRESHOLD ? '松开刷新' : '下拉刷新'}
            </span>
          </div>

          {/* 列表 */}
          <div style={{ transform: `translateY(${pullDistance}px)`, transition: isRefreshing ? 'transform 0.2s ease' : 'none' }}>
            <div className="flex flex-col gap-3">
              {paginatedDishes.map((dish) => (<DishCard key={dish.id} dish={dish} />))}
            </div>

            {/* 空状态 */}
            {filteredDishes.length === 0 && (
              <div className="text-center py-10 px-4" style={{ border: '3px solid var(--color-ink)', borderRadius: '22px', background: 'white', boxShadow: '7px 7px 0 var(--color-shadow-blue)' }}>
                <div className="text-5xl mb-3">🍽️</div>
                <p className="font-black text-base mb-1" style={{ color: 'var(--color-ink)' }}>没有找到相关菜品</p>
                <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>换个关键词或分类试试？</p>
                {hasActiveSearch && (
                  <button onClick={clearSearch} className="px-5 py-2 text-xs font-black transition-transform duration-150 active:scale-[0.95]" style={{ background: 'var(--color-ink)', color: 'white', border: '3px solid var(--color-ink)', borderRadius: '14px', boxShadow: '4px 4px 0 var(--color-shadow-blue)' }}>清除筛选</button>
                )}
              </div>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm font-black transition-transform duration-150 active:scale-[0.95] disabled:opacity-40" style={{ background: 'var(--color-ink)', color: 'white', border: '3px solid var(--color-ink)', borderRadius: '14px', boxShadow: '4px 4px 0 var(--color-shadow-blue)' }}>上一页</button>
                <span className="text-sm font-bold" style={{ color: 'var(--color-muted)' }}>{page} / {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm font-black transition-transform duration-150 active:scale-[0.95] disabled:opacity-40" style={{ background: 'var(--color-ink)', color: 'white', border: '3px solid var(--color-ink)', borderRadius: '14px', boxShadow: '4px 4px 0 var(--color-shadow-blue)' }}>下一页</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
