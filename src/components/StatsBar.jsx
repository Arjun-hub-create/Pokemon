import React, { useEffect, useState } from 'react'
import { useScrollReveal } from '../hooks/useScroll'

function CountUp({ target, duration = 1200, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [ref, visible] = useScrollReveal()

  useEffect(() => {
    if (!visible) return
    let start = null
    let frame

    function step(timestamp) {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [visible, target, duration])

  return (
    <span ref={ref} className="counter-number">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

function StatsBar({ totalFavs, totalSeen }) {
  const [ref, visible] = useScrollReveal()

  return (
    <div ref={ref} className={`stats-strip ${visible ? 'stats-strip-visible' : ''}`}>
      <div className="stat-pill">
        <span className="stat-pill-icon">🌍</span>
        <div>
          <CountUp target={649} suffix="+" />
          <div className="stat-pill-label">Pokémon</div>
        </div>
      </div>
      <div className="stat-pill">
        <span className="stat-pill-icon">🔥</span>
        <div>
          <CountUp target={18} />
          <div className="stat-pill-label">Types</div>
        </div>
      </div>
      <div className="stat-pill">
        <span className="stat-pill-icon">⭐</span>
        <div>
          <CountUp target={totalFavs} />
          <div className="stat-pill-label">Your Favs</div>
        </div>
      </div>
      <div className="stat-pill">
        <span className="stat-pill-icon">👁️</span>
        <div>
          <CountUp target={totalSeen} />
          <div className="stat-pill-label">Pages Seen</div>
        </div>
      </div>
    </div>
  )
}

export default StatsBar
