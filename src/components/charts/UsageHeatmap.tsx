import { useMemo } from 'react'
import { interpolateColor } from '@/lib/utils'
import type { HeatmapCell } from '@/types/analytics'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

interface Props {
  data: HeatmapCell[]
}

export function UsageHeatmap({ data }: Props) {
  const { matrix, maxVal } = useMemo(() => {
    const matrix: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0))
    let maxVal = 0
    for (const cell of data) {
      matrix[cell.day_of_week][cell.hour] = cell.avg_kwh
      if (cell.avg_kwh > maxVal) maxVal = cell.avg_kwh
    }
    return { matrix, maxVal }
  }, [data])

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Hour labels */}
        <div className="mb-1 ml-10 flex gap-px">
          {HOURS.map((h) => (
            <div key={h} className="w-7 text-center text-[9px] text-gray-400">
              {h % 4 === 0 ? `${h}h` : ''}
            </div>
          ))}
        </div>

        {/* Grid */}
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="mb-px flex items-center gap-px">
            <span className="mr-1 w-9 text-right text-[10px] text-gray-500">{day}</span>
            {HOURS.map((hour) => {
              const val = matrix[dayIdx][hour]
              const t = maxVal > 0 ? val / maxVal : 0
              return (
                <div
                  key={hour}
                  title={`${day} ${hour}:00 — ${val.toFixed(2)} kWh`}
                  style={{ backgroundColor: interpolateColor(t) }}
                  className="h-6 w-7 rounded-sm"
                />
              )
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="mt-2 ml-10 flex items-center gap-1">
          <span className="text-[10px] text-gray-400">Low</span>
          <div className="flex h-2.5 w-24 rounded overflow-hidden">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ backgroundColor: interpolateColor(i / 19) }}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">High</span>
          <span className="ml-2 text-[10px] text-gray-400">(avg kWh)</span>
        </div>
      </div>
    </div>
  )
}
