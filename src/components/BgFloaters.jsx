import React, { useMemo } from 'react'

// A small set of silhouettes that float in the bg — purely decorative
// Using low IDs so images are definitely available
const FLOATER_IDS = [143, 94, 131, 6, 149, 59, 78]

function BgFloaters() {
  const floaters = useMemo(() => {
    return FLOATER_IDS.map((id, i) => ({
      id,
      left: `${5 + i * 13}%`,
      top: `${15 + (i * 17) % 60}%`,
      size: 80 + (i * 20) % 60,
      dur: `${18 + i * 4}s`,
      delay: `${i * 3}s`,
      fx: `${(i % 2 === 0 ? 1 : -1) * (20 + i * 10)}px`,
      fy: `${-20 - (i * 8) % 40}px`,
    }))
  }, [])

  return (
    <>
      {floaters.map(f => (
        <img
          key={f.id}
          className="bg-floater"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${f.id}.png`}
          alt=""
          aria-hidden="true"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            '--float-dur': f.dur,
            '--float-delay': f.delay,
            '--fx': f.fx,
            '--fy': f.fy,
          }}
        />
      ))}
    </>
  )
}

export default BgFloaters
