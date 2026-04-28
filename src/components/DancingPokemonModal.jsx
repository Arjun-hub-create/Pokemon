import React, { useState, useEffect, useCallback } from 'react'

// A sequence of real dance-step keyframes that the pokemon cycles through
const DANCE_MOVES = [
  'danceMove-hiphop',
  'danceMove-salsa',
  'danceMove-breakdance',
  'danceMove-moonwalk',
  'danceMove-twist',
  'danceMove-floss',
  'danceMove-robot',
  'danceMove-wave',
]

function DancingPokemonImg({ imgSrc, name, isDancing }) {
  const [moveIndex, setMoveIndex] = useState(0)

  useEffect(() => {
    if (!isDancing) return
    const interval = setInterval(() => {
      setMoveIndex(prev => (prev + 1) % DANCE_MOVES.length)
    }, 1800) // switch dance move every 1.8s
    return () => clearInterval(interval)
  }, [isDancing])

  return (
    <div className={`dancing-pokemon-stage ${isDancing ? 'is-dancing' : ''}`}>
      {/* Disco floor effect */}
      {isDancing && (
        <div className="disco-floor">
          <div className="disco-tile t1" />
          <div className="disco-tile t2" />
          <div className="disco-tile t3" />
          <div className="disco-tile t4" />
          <div className="disco-tile t5" />
          <div className="disco-tile t6" />
          <div className="disco-tile t7" />
          <div className="disco-tile t8" />
          <div className="disco-tile t9" />
        </div>
      )}

      {/* Sparkle particles when dancing */}
      {isDancing && (
        <div className="dance-sparkles">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="dance-sparkle"
              style={{
                '--sparkle-delay': `${i * 0.15}s`,
                '--sparkle-x': `${-60 + (i * 11) % 120}px`,
                '--sparkle-y': `${-40 - (i * 8) % 80}px`,
                '--sparkle-rotate': `${(i * 30) % 360}deg`,
              }}
            >
              {['✨', '⭐', '💫', '🌟'][i % 4]}
            </span>
          ))}
        </div>
      )}

      {/* The dancing pokemon image */}
      <img
        className={`dancing-pokemon-img ${isDancing ? DANCE_MOVES[moveIndex] : ''}`}
        src={imgSrc}
        alt={name}
        onError={e => {
          e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${name}.png`
        }}
      />

      {/* Shadow that reacts to dancing */}
      <div className={`dancing-shadow ${isDancing ? 'shadow-dancing' : ''}`} />

      {/* Music notes floating */}
      {isDancing && (
        <div className="music-notes">
          {['🎵', '🎶', '🎵', '🎶', '🎵', '🎶'].map((note, i) => (
            <span
              key={i}
              className="music-note"
              style={{
                '--note-delay': `${i * 0.4}s`,
                '--note-x': `${(i % 2 === 0 ? -1 : 1) * (20 + i * 12)}px`,
              }}
            >
              {note}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default DancingPokemonImg
