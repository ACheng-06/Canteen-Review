interface TagProps {
  children: string
  color?: string
  className?: string
}

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'var(--color-soft-blue)', text: 'var(--color-blue)' },
  green: { bg: 'var(--color-soft-green)', text: 'var(--color-green)' },
  amber: { bg: 'var(--color-soft-amber)', text: '#6B4E16' },
  red: { bg: 'var(--color-soft-red)', text: 'var(--color-red)' },
  pink: { bg: '#FFF0F7', text: 'var(--color-pink)' },
  cyan: { bg: '#E8FAFF', text: 'var(--color-cyan)' },
}

export default function Tag({ children, color = 'blue', className = '' }: TagProps) {
  const c = colorMap[color] || colorMap.blue
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-bold ${className}`}
      style={{
        background: c.bg,
        color: c.text,
        border: '2px solid var(--color-ink)',
        borderRadius: 'var(--radius-pill)',
      }}
    >
      {children}
    </span>
  )
}
