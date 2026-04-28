import React, { useEffect, useState } from 'react'

const COLORS = ['#ffd700', '#ff6b35', '#4fc3f7', '#66bb6a', '#f06292', '#ab47bc', '#fdd835', '#ff4081']
const SHAPES = ['circle', 'square', 'star']

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function ConfettiBurst({ x, y, onDone }) {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      angle: (i / 30) * 360 + randomBetween(-15, 15),
      velocity: randomBetween(60, 140),
      spin: randomBetween(-400, 400),
      scale: randomBetween(0.5, 1.2),
      decay: randomBetween(0.85, 0.95),
    }))
  )

  useEffect(() => {
    const timer = setTimeout(onDone, 1200)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="confetti-container" style={{ left: x, top: y }}>
      {particles.map(p => (
        <span
          key={p.id}
          className={`confetti-particle confetti-${p.shape}`}
          style={{
            '--confetti-color': p.color,
            '--confetti-angle': `${p.angle}deg`,
            '--confetti-velocity': `${p.velocity}px`,
            '--confetti-spin': `${p.spin}deg`,
            '--confetti-scale': p.scale,
            '--confetti-delay': `${p.id * 0.01}s`,
          }}
        />
      ))}
    </div>
  )
}

// Manages multiple confetti bursts
function ConfettiManager({ bursts, onBurstDone }) {
  return (
    <div className="confetti-layer">
      {bursts.map(burst => (
        <ConfettiBurst
          key={burst.id}
          x={burst.x}
          y={burst.y}
          onDone={() => onBurstDone(burst.id)}
        />
      ))}
    </div>
  )
}

export default ConfettiManager
