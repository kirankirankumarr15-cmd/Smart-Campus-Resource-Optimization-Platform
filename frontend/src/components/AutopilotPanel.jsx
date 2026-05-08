import { useState } from 'react'
import { Play, Loader2, CheckCircle2 } from 'lucide-react'

const STEPS = [
  "Ingest current campus state",
  "Run 60-min prediction engine",
  "Execute optimization algorithm",
  "Generate ranked action plan",
  "Auto-apply SAFE actions",
  "Queue CRITICAL actions for approval",
  "Display live impact metrics",
]

export default function AutopilotPanel({ onComplete }) {
  const [running, setRunning] = useState(false)
  const [doneIdx, setDoneIdx] = useState(-1)
  const [currentIdx, setCurrentIdx] = useState(-1)

  const handleRun = () => {
    setRunning(true)
    setDoneIdx(-1)
    setCurrentIdx(0)
    let i = 0
    const interval = setInterval(() => {
      setDoneIdx(i)
      i++
      if (i >= STEPS.length) {
        clearInterval(interval)
        setRunning(false)
        setCurrentIdx(-1)
        onComplete?.()
      } else {
        setCurrentIdx(i)
      }
    }, 600)
  }

  return (
    <div className="bg-navy text-white rounded-card p-5 h-full flex flex-col">
      <div className="mb-4">
        <p className="text-label uppercase tracking-wider text-white/50">Autopilot</p>
        <h3 className="text-hero font-medium">Campus Autopilot</h3>
        <p className="text-body text-white/60 mt-1">
          One click — sense, decide, actuate.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={handleRun}
        disabled={running}
        className="w-full h-12 bg-orange hover:bg-orange/90 disabled:opacity-70
                   text-white text-nav font-medium rounded-pill
                   flex items-center justify-center gap-2 transition-colors"
      >
        {running ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
        {running ? "Running pipeline…" : "Optimize Campus Now"}
      </button>

      {/* 7-step pipeline */}
      <div className="mt-5 space-y-2 flex-1">
        {STEPS.map((label, i) => {
          const isDone = i <= doneIdx
          const isActive = i === currentIdx && running
          return (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`pipeline-step w-7 h-7 rounded-full flex items-center justify-center text-label font-medium shrink-0
                  ${isDone ? "done text-navy" : "bg-white/10 text-white/60"}`}
              >
                {isDone ? <CheckCircle2 size={14} /> :
                 isActive ? <Loader2 size={12} className="animate-spin" /> :
                 i + 1}
              </div>
              <span className={`text-body ${isDone ? "text-white" : "text-white/60"}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
