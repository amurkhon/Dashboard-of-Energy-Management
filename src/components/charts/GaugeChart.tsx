interface GaugeChartProps {
  value: number // 0–100
  label?: string
  size?: number
}

export function GaugeChart({ value, label = 'Battery', size = 120 }: GaugeChartProps) {
  const r = 48
  const cx = 60
  const cy = 60
  const circumference = Math.PI * r // half-circle

  const clampedValue = Math.max(0, Math.min(100, value))
  const offset = circumference - (clampedValue / 100) * circumference

  const color =
    clampedValue < 20 ? '#ef4444' : clampedValue < 40 ? '#f59e0b' : '#22c55e'

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size * 0.6} viewBox="20 30 80 40">
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 800ms ease, stroke 400ms ease' }}
        />
        {/* Text */}
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="14" fontWeight="700" fill="#111827">
          {Math.round(clampedValue)}%
        </text>
      </svg>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  )
}
