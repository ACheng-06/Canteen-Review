import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRanking } from '../api/ranking'
import { getCategoryVisual } from '../utils/categoryVisual'
import type { RankPeriod, RankCategory } from '../types'

const periodTabs: { label: string; value: RankPeriod }[] = [
  { label: '日榜', value: 'today' },
  { label: '周榜', value: 'week' },
  { label: '月榜', value: 'month' },
]

const categoryTabs: { label: string; value: RankCategory; emoji: string }[] = [
  { label: '人气', value: 'popularity', emoji: '🔥' },
  { label: '出餐快', value: 'speed', emoji: '⚡' },
  { label: '省钱', value: 'value', emoji: '💰' },
]

export default function RankingPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<RankPeriod>('today')
  const [category, setCategory] = useState<RankCategory>('popularity')
  const [rankedDishes, setRankedDishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRanking() {
      try {
        const data = await getRanking(category, period)
        setRankedDishes(data)
      } catch (err) {
        console.error('Failed to fetch ranking:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRanking()
  }, [category, period])

  const sorted = useMemo(() => {
    const key =
      category === 'popularity'
        ? 'popularity'
        : category === 'speed'
          ? 'speedScore'
          : 'valueScore'
    const list = [...rankedDishes]
    list.sort((a, b) => {
      const diff = b[key] - a[key]
      // Week/month rankings factor in review count as tiebreaker
      if (period === 'week' || period === 'month') {
        return diff !== 0 ? diff : b.reviewCount - a.reviewCount
      }
      return diff
    })
    return list
  }, [rankedDishes, period, category])

  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3, 10)

  const rankLabels = ['🥇', '🥈', '🥉']
  const rankShadows = ['#FFCF7A', '#E0E0E0', '#D7CCC8']

  const updatePeriod = (nextPeriod: RankPeriod) => {
    setPeriod(nextPeriod)
  }

  const updateCategory = (nextCategory: RankCategory) => {
    setCategory(nextCategory)
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
      <div className="safe-area-top" />
      <div className="px-4">
      {/* Hero */}
      <div
        className="relative mt-4 p-5 overflow-hidden"
        style={{
          background: 'white',
          border: '3px solid var(--color-ink)',
          borderRadius: '28px',
          boxShadow: '10px 10px 0 var(--color-shadow-blue)',
        }}
      >
        <h1 className="text-shadow-pop font-black text-xl">🏆 菜品排行榜</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
          看看大家都在吃什么
        </p>
      </div>

      {/* Period tabs — capsule slider */}
      <div
        className="flex mt-4 p-1"
        style={{
          background: 'var(--color-bg)',
          border: '3px solid var(--color-ink)',
          borderRadius: '999px',
        }}
      >
        {periodTabs.map((tab) => {
          const active = period === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => updatePeriod(tab.value)}
              className="flex-1 py-1.5 text-sm font-black"
              style={{
                background: active ? 'white' : 'transparent',
                color: active ? 'var(--color-ink)' : 'var(--color-muted)',
                borderRadius: '999px',
                border: active ? '2px solid var(--color-ink)' : '2px solid transparent',
                boxShadow: active ? '3px 3px 0 var(--color-shadow-blue)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Category tabs — capsule slider */}
      <div
        className="flex mt-3 p-1"
        style={{
          background: 'var(--color-bg)',
          border: '2px solid var(--color-ink)',
          borderRadius: '999px',
        }}
      >
        {categoryTabs.map((tab) => {
          const active = category === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => updateCategory(tab.value)}
              className="flex-1 py-1.5 text-xs font-black"
              style={{
                background: active ? 'white' : 'transparent',
                color: active ? 'var(--color-ink)' : 'var(--color-muted)',
                borderRadius: '999px',
                border: active ? '2px solid var(--color-ink)' : '2px solid transparent',
                boxShadow: active ? '2px 2px 0 var(--color-shadow-amber)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {tab.emoji} {tab.label}
            </button>
          )
        })}
      </div>

      {/* Top 3 podium — order: 2nd - 1st - 3rd */}
      <div className="flex items-end gap-2 mt-5">
        {[1, 0, 2].map((idx) => {
          const dish = top3[idx]
          if (!dish) return null
          const isFirst = idx === 0
          return (
            <div
              key={dish.id}
              onClick={() => navigate(`/dishes/${dish.id}`)}
              className="bg-white cursor-pointer"
              style={{
                border: '3px solid var(--color-ink)',
                borderRadius: '18px',
                boxShadow: `6px 6px 0 ${rankShadows[idx]}`,
                flex: isFirst ? '1.3' : '1',
                padding: isFirst ? '14px 10px' : '10px 8px',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)'
                e.currentTarget.style.boxShadow = `3px 3px 0 ${rankShadows[idx]}`
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = `6px 6px 0 ${rankShadows[idx]}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = `6px 6px 0 ${rankShadows[idx]}`
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)'
                e.currentTarget.style.boxShadow = `3px 3px 0 ${rankShadows[idx]}`
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = `6px 6px 0 ${rankShadows[idx]}`
              }}
            >
              <div
                className="text-center mb-1"
                style={{ fontSize: isFirst ? '28px' : '22px' }}
              >
                {rankLabels[idx]}
              </div>
              <div
                className="w-full flex items-center justify-center mb-2"
                style={{
                  background: getCategoryVisual(dish.category).bg,
                  borderRadius: '14px',
                  border: '2px solid var(--color-ink)',
                  height: isFirst ? '80px' : '56px',
                  fontSize: isFirst ? '36px' : '28px',
                }}
              >
                {getCategoryVisual(dish.category).emoji}
              </div>
              <div
                className="font-black text-center truncate"
                style={{ fontSize: isFirst ? '15px' : '13px' }}
              >
                {dish.name}
              </div>
              <div
                className="text-center mt-0.5"
                style={{
                  color: 'var(--color-muted)',
                  fontSize: isFirst ? '13px' : '11px',
                }}
              >
                {category === 'popularity'
                  ? `人气 ${dish.popularity}`
                  : category === 'speed'
                    ? `速度 ${dish.speedScore.toFixed(1)}`
                    : `性价比 ${dish.valueScore.toFixed(1)}`}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="mt-5">
          <div
            className="text-center py-10 px-4"
            style={{
              border: '3px solid var(--color-ink)',
              borderRadius: '22px',
              background: 'white',
              boxShadow: '7px 7px 0 var(--color-shadow-blue)',
            }}
          >
            <div className="text-5xl mb-3">🏆</div>
            <p className="font-black text-base mb-1" style={{ color: 'var(--color-ink)' }}>暂无排行数据</p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>快去评价菜品，争夺排行榜吧！</p>
          </div>
        </div>
      )}

      {/* Rest of ranking (4-10) */}
      {rest.length > 0 && (
        <div
          className="mt-4 overflow-hidden"
          style={{
            border: '3px solid var(--color-ink)',
            borderRadius: '20px',
            boxShadow: '5px 5px 0 var(--color-shadow-blue)',
            background: 'white',
          }}
        >
          {rest.map((dish, i) => {
            const rank = i + 4
            const isLast = i === rest.length - 1
            return (
              <div
                key={dish.id}
                onClick={() => navigate(`/dishes/${dish.id}`)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                style={{
                  borderBottom: isLast ? 'none' : '2px solid #F5F6FA',
                  background: i % 2 === 0 ? 'white' : 'var(--color-paper)',
                  transition: 'transform 0.2s ease, background 0.15s ease',
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)'
                  e.currentTarget.style.background = 'var(--color-bg)'
                }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)'
                  e.currentTarget.style.background = 'var(--color-bg)'
                }}
                onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                <span
                  className="w-6 h-6 flex items-center justify-center text-xs font-black rounded"
                  style={{
                    background: 'var(--color-bg)',
                    border: '2px solid var(--color-ink)',
                  }}
                >
                  {rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{dish.name}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    ⭐ {dish.rating.toFixed(1)} · ¥{dish.price}
                  </div>
                </div>
                <div className="text-sm font-black" style={{ color: 'var(--color-blue)' }}>
                  {category === 'popularity'
                    ? dish.popularity
                    : category === 'speed'
                      ? dish.speedScore.toFixed(1)
                      : dish.valueScore.toFixed(1)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      </div>
    </div>
  )
}
