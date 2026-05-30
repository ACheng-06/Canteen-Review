import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRanking } from '../api/ranking'
import type { RankPeriod, RankCategory } from '../types'

const periodTabs: { label: string; value: RankPeriod }[] = [
  { label: '今日榜', value: 'today' },
  { label: '本周榜', value: 'week' },
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
  const [page, setPage] = useState(1)
  const [rankedDishes, setRankedDishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const pageSize = 8

  useEffect(() => {
    async function fetchRanking() {
      try {
        const data = await getRanking(category)
        setRankedDishes(data)
      } catch (err) {
        console.error('Failed to fetch ranking:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRanking()
  }, [category])

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
      // Week rankings factor in review count as tiebreaker
      if (period === 'week') {
        return diff !== 0 ? diff : b.reviewCount - a.reviewCount
      }
      return diff
    })
    return list
  }, [rankedDishes, period, category])

  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)
  const totalPages = Math.ceil(rest.length / pageSize)
  const paginatedRest = rest.slice((page - 1) * pageSize, page * pageSize)

  const rankLabels = ['🥇', '🥈', '🥉']
  const rankShadows = ['#FFCF7A', '#E0E0E0', '#D7CCC8']

  const updatePeriod = (nextPeriod: RankPeriod) => {
    setPeriod((current) => {
      if (current !== nextPeriod) {
        setPage(1)
      }
      return nextPeriod
    })
  }

  const updateCategory = (nextCategory: RankCategory) => {
    setCategory((current) => {
      if (current !== nextCategory) {
        setPage(1)
      }
      return nextCategory
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" style={{ background: 'var(--color-paper)' }}>
        <div className="text-lg font-black" style={{ color: 'var(--color-muted)' }}>加载中...</div>
      </div>
    )
  }

  return (
    <div
      className="px-4 "
      style={{ background: 'var(--color-paper)' }}
    >
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

      {/* Period tabs */}
      <div className="flex gap-2 mt-4">
        {periodTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => updatePeriod(tab.value)}
            className="px-4 py-1.5 text-sm font-bold transition-transform duration-150 active:scale-[0.97]"
            style={{
              background:
                period === tab.value
                  ? 'linear-gradient(135deg, #172033 0%, #172033 60%, #FF4FB8 60%, #FF4FB8 100%)'
                  : 'white',
              color: period === tab.value ? 'white' : 'var(--color-ink)',
              border: '3px solid var(--color-ink)',
              borderRadius: '16px',
              boxShadow: period === tab.value ? '4px 4px 0 var(--color-amber)' : '4px 4px 0 var(--color-shadow-blue)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mt-3">
        {categoryTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => updateCategory(tab.value)}
            className="px-3 py-1.5 text-xs font-bold transition-transform duration-150"
            style={{
              background: category === tab.value ? 'var(--color-soft-amber)' : 'white',
              color: category === tab.value ? 'var(--color-ink)' : 'var(--color-muted)',
              border: `2px solid ${category === tab.value ? 'var(--color-ink)' : 'var(--color-line)'}`,
              borderRadius: 'var(--radius-pill)',
            }}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
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
              className="bg-white cursor-pointer transition-transform duration-150 active:scale-[0.99]"
              style={{
                border: '3px solid var(--color-ink)',
                borderRadius: '18px',
                boxShadow: `6px 6px 0 ${rankShadows[idx]}`,
                flex: isFirst ? '1.3' : '1',
                padding: isFirst ? '14px 10px' : '10px 8px',
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
                  background: 'var(--color-soft-amber)',
                  borderRadius: '14px',
                  border: '2px solid var(--color-ink)',
                  height: isFirst ? '80px' : '56px',
                  fontSize: isFirst ? '32px' : '24px',
                }}
              >
                🍽️
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

      {/* Rest of ranking */}
      <div
        className="mt-4 overflow-hidden"
        style={{
          border: '3px solid var(--color-ink)',
          borderRadius: '20px',
          boxShadow: '5px 5px 0 var(--color-shadow-blue)',
          background: 'white',
        }}
      >
        {paginatedRest.map((dish, i) => {
          const rank = (page - 1) * pageSize + i + 4
          return (
            <div
              key={dish.id}
              onClick={() => navigate(`/dishes/${dish.id}`)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
              style={{
                borderBottom: i < paginatedRest.length - 1 ? '2px solid #F5F6FA' : 'none',
                background: i % 2 === 0 ? 'white' : 'var(--color-paper)',
              }}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 text-sm font-black transition-transform duration-150 active:scale-[0.97] disabled:opacity-40"
            style={{
              background: '#172033',
              color: 'white',
              border: '3px solid var(--color-ink)',
              borderRadius: '14px',
              boxShadow: '4px 4px 0 var(--color-shadow-blue)',
            }}
          >
            上一页
          </button>
          <span
            className="px-3 py-1 text-sm font-bold"
            style={{
              background: 'var(--color-soft-amber)',
              border: '2px solid var(--color-ink)',
              borderRadius: '10px',
            }}
          >
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 text-sm font-black transition-transform duration-150 active:scale-[0.97] disabled:opacity-40"
            style={{
              background: '#172033',
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
  )
}
