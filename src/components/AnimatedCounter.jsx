import { useEffect, useState } from 'react'

export default function AnimatedCounter({ value, suffix, label }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let frameId
    const duration = 1400
    const start = performance.now()

    const updateValue = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) {
        frameId = requestAnimationFrame(updateValue)
      }
    }

    frameId = requestAnimationFrame(updateValue)
    return () => cancelAnimationFrame(frameId)
  }, [value])

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
      <div className="font-display text-3xl font-bold text-white">
        {count}
        {suffix}
      </div>
      <p className="mt-2 text-sm text-slate-200">{label}</p>
    </div>
  )
}
