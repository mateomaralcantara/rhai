type Props = {
    current: number
    total: number
  }
  
  export default function ProgressBar({ current, total }: Props) {
    const pct = Math.max(0, Math.min(100, (current / total) * 100))
  
    return (
      <div className="w-full">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
          <span>Progreso</span>
          <span>{current}/{total}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    )
  }