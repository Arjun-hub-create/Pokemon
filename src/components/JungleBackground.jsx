import React, { useMemo } from 'react'

const LEAF_EMOJIS = ['🍃', '🌿', '🍀', '☘️', '🌱', '🍂', '🍁']

function JungleBackground() {
  const leaves = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      emoji: LEAF_EMOJIS[i % LEAF_EMOJIS.length],
      left: `${5 + (i * 5.5) % 90}%`,
      size: `${14 + (i * 7) % 16}px`,
      duration: `${7 + (i * 1.3) % 10}s`,
      delay: `${(i * 0.8) % 8}s`,
      spin: `${(i % 2 === 0 ? 1 : -1) * (200 + (i * 50) % 300)}deg`,
      sway: `${(i % 2 === 0 ? 1 : -1) * (30 + (i * 15) % 80)}px`,
    }))
  }, [])

  const fireflies = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${8 + (i * 8) % 85}%`,
      top: `${10 + (i * 7) % 80}%`,
      duration: `${6 + (i * 0.9) % 8}s`,
      delay: `${(i * 0.6) % 5}s`,
      tx: `${(i % 2 === 0 ? 1 : -1) * (20 + (i * 12) % 60)}px`,
      ty: `${-20 - (i * 10) % 60}px`,
    }))
  }, [])

  const vines = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${6 + i * 13}%`,
      height: `${55 + (i * 15) % 60}px`,
      duration: `${3 + (i * 0.5) % 3}s`,
      delay: `${(i * 0.4) % 2}s`,
      emoji: i % 3 === 0 ? '🌿' : i % 3 === 1 ? '🍃' : '🌱',
    }))
  }, [])

  return (
    <>
      <div className="jungle-bg">
        <div className="mist-layer" />
        <div className="mist-layer" />
        <div className="mist-layer" />
        {fireflies.map(ff => (
          <div
            key={ff.id}
            className="firefly"
            style={{
              left: ff.left,
              top: ff.top,
              '--duration': ff.duration,
              '--delay': ff.delay,
              '--tx': ff.tx,
              '--ty': ff.ty,
            }}
          />
        ))}
      </div>

      <div className="leaves-container">
        {leaves.map(leaf => (
          <div
            key={leaf.id}
            className="leaf"
            style={{
              left: leaf.left,
              '--size': leaf.size,
              '--duration': leaf.duration,
              '--delay': leaf.delay,
              '--spin': leaf.spin,
              '--sway': leaf.sway,
            }}
          >
            {leaf.emoji}
          </div>
        ))}
      </div>

      <div className="vine-container">
        {vines.map(vine => (
          <div
            key={vine.id}
            className="vine"
            style={{
              left: vine.left,
              height: `${vine.height}px`,
              '--duration': vine.duration,
              '--delay': vine.delay,
              '--emoji': `"${vine.emoji}"`,
            }}
          />
        ))}
      </div>
    </>
  )
}

export default JungleBackground
