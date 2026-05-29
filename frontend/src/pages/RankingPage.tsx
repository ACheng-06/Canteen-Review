import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dishes } from '../mock'
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

  const sorted = useMemo(() => {
    const key =
      category === 'popularity'
        ? 'popularity'
        : category === 'speed'
          ? 'speedScore'
          : 'valueScore'
    const list = [...dishes]
    list.sort((a, b) => b[key] - a[key])
    return list
  }, [period, category])

  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  const rankLabels = ['🥇', '🥈', '🥉']
  const rankShadows = ['#FFCF7A', '#E0E0E0', '#D7CCC8']

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
            onClick={() => setPeriod(tab.value)}
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
            onClick={() => setCategory(tab.value)}
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

      {/* Top 3 podium */}
      <div className="flex gap-2 mt-5">
        {top3.map((dish, i) => (
          <div
            key={dish.id}
            onClick={() => navigate(`/dishes/${dish.id}`)}
            className="flex-1 p-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.99]"
            style={{
              border: '3px solid var(--color-ink)',
              borderRadius: '18px',
              boxShadow: `6px 6px 0 ${rankShadows[i]}`,
              flex: i === 0 ? '1.25' : '1',
            }}
          >
            <div className="text-2xl text-center mb-1">{rankLabels[i]}</div>
            <div
              className="w-full h-16 flex items-center justify-center text-2xl mb-2"
              style={{
                background: 'var(--color-soft-amber)',
                borderRadius: '14px',
                border: '2px solid var(--color-ink)',
              }}
            >
              🍽️
            </div>
            <div className="font-black text-sm text-center truncate">{dish.name}</div>
            <div className="text-xs text-center mt-0.5" style={{ color: 'var(--color-muted)' }}>
              {category === 'popularity'
                ? `人气 ${dish.popularity}`
                : category === 'speed'
                  ? `速度 ${dish.speedScore.toFixed(1)}`
                  : `性价比 ${dish.valueScore.toFixed(1)}`}
            </div>
          </div>
        ))}
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
        {rest.map((dish, i) => (
          <div
            key={dish.id}
            onClick={() => navigate(`/dishes/${dish.id}`)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
            style={{
              borderBottom: i < rest.length - 1 ? '2px solid #F5F6FA' : 'none',
              background: i % 2 === 0 ? 'white' : 'var(--color-paper)',
            }}
          >
            <span
              className="w-6 h-6 flex items-center justify-center text-xs font-black rounded"
              style={{
                background: i < 3 ? '#FFC107' : 'var(--color-bg)',
                border: '2px solid var(--color-ink)',
              }}
            >
              {i + 4}
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
        ))}
      </div>
    </div>
  )
}
