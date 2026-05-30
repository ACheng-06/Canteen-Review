import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: '首页', icon: '🏠', activeIcon: '🏡' },
  { path: '/ranking', label: '排行', icon: '🏆', activeIcon: '🥇' },
  { path: '/canteens', label: '食堂', icon: '🍜', activeIcon: '🍲' },
  { path: '/profile', label: '我的', icon: '👤', activeIcon: '😊' },
]

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  // Hide tab bar on detail pages
  const isDetailPage =
    location.pathname.startsWith('/canteens/') ||
    location.pathname.startsWith('/dishes/')

  return (
    <div className="relative min-h-screen pb-[100px]">
      <Outlet />

      {!isDetailPage && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{
            background: 'var(--color-paper)',
          }}
        >
          <div
            className="flex items-center justify-around px-2 py-2 dot-pattern mx-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              border: '3px solid var(--color-ink)',
              borderRadius: 'var(--radius-tab)',
              boxShadow: '0 -8px 24px rgba(23, 32, 51, 0.08), 7px 7px 0 var(--color-shadow-blue)',
              maxWidth: '354px',
              width: 'calc(100% - 36px)',
            }}
          >
            {tabs.map((tab) => {
              const isActive =
                tab.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(tab.path)

              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all duration-150"
                  style={{
                    borderRadius: 'var(--radius-card)',
                    background: isActive ? 'var(--color-soft-amber)' : 'transparent',
                    border: isActive ? '3px solid var(--color-ink)' : '3px solid transparent',
                    boxShadow: isActive ? '4px 4px 0 var(--color-amber)' : 'none',
                    transform: isActive ? 'rotate(-3deg) translateY(-4px)' : 'none',
                  }}
                >
                  <span
                    className="text-xl"
                    style={{
                      filter: isActive
                        ? 'none'
                        : 'grayscale(1) brightness(0.72) contrast(1.18) opacity(0.82)',
                      transform: isActive ? 'scale(1.08)' : 'none',
                    }}
                  >
                    {isActive ? tab.activeIcon : tab.icon}
                  </span>
                  <span
                    className="text-[11px] leading-tight"
                    style={{
                      fontWeight: isActive ? 900 : 700,
                      color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
