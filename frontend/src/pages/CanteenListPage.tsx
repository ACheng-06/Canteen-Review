import { useState, useEffect } from 'react'
import { getCanteens } from '../api/canteens'
import CanteenCard from '../components/CanteenCard'
import type { Canteen } from '../types'

export default function CanteenListPage() {
  const [canteens, setCanteens] = useState<Canteen[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCanteens()
      .then((data) => setCanteens(data))
      .catch((err) => console.error('Failed to load canteens:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div
      className="px-4 pb-[120px]"
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
        <h1 className="text-shadow-pop font-black text-xl">🏫 食堂列表</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
          选择一个食堂开始探索
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10" style={{ color: 'var(--color-muted)' }}>
          加载中...
        </div>
      )}

      {/* Canteen list */}
      {!loading && (
        <div className="flex flex-col gap-3 mt-5">
          {canteens.map((canteen, i) => (
            <CanteenCard key={canteen.id} canteen={canteen} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
