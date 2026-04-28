import React, { useEffect, useCallback, useState } from 'react'
import { getTypeColor, STAT_COLORS } from '../utils/typeColors'
import DancingPokemonImg from './DancingPokemonModal'

function getPokemonImage(pokemon) {
  return (
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  )
}

const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP.ATK',
  'special-defense': 'SP.DEF',
  speed: 'SPD',
}

function StatBar({ stat }) {
  const name = stat.stat.name
  const value = stat.base_stat
  const pct = Math.min((value / 255) * 100, 100)
  const color = STAT_COLORS[name] || '#4caf50'
  const label = STAT_LABELS[name] || name

  return (
    <div className="stat-row">
      <span className="stat-name">{label}</span>
      <div className="stat-bar-wrap">
        <div
          className="stat-bar"
          style={{ width: `${pct}%`, '--stat-color': color }}
        />
      </div>
      <span className="stat-value">{value}</span>
    </div>
  )
}

function PokemonModal({ pokemon, isFav, onToggleFav, onClose }) {
  const [isDancing, setIsDancing] = useState(true) // start dancing by default!
  const types = pokemon.types?.map(t => t.type.name) || []
  const primaryColor = getTypeColor(types[0] || 'normal')
  const imgSrc = getPokemonImage(pokemon)
  const abilities = pokemon.abilities || []
  const moves = pokemon.moves?.slice(0, 20) || []
  const stats = pokemon.stats || []

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const heightM = (pokemon.height / 10).toFixed(1)
  const weightKg = (pokemon.weight / 10).toFixed(1)
  const baseExp = pokemon.base_experience || '—'

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${pokemon.name} details`}
    >
      <div className="modal-panel">
        <div className="modal-header">
          {/* Dance toggle button */}
          <button
            className={`dance-toggle-btn ${isDancing ? 'dancing' : ''}`}
            onClick={() => setIsDancing(d => !d)}
            aria-label={isDancing ? 'Stop dancing' : 'Start dancing'}
            title={isDancing ? 'Stop dancing' : 'Make it dance!'}
          >
            {isDancing ? '🕺 Dancing!' : '💃 Dance?'}
          </button>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Header with Dancing Pokemon */}
          <div className="modal-pokemon-header">
            <div
              className="modal-pokemon-img-wrap"
              style={{ '--type-color-primary': `${primaryColor}33` }}
            >
              <div className="modal-pokemon-bg-circle" />
              <DancingPokemonImg
                imgSrc={imgSrc}
                name={pokemon.name}
                isDancing={isDancing}
              />
            </div>

            <p className="modal-id">#{String(pokemon.id).padStart(3, '0')}</p>
            <h2 className={`modal-name ${isDancing ? 'name-dancing' : ''}`}>{pokemon.name}</h2>

            <div className="modal-types">
              {types.map(type => (
                <span
                  key={type}
                  className="modal-type-badge"
                  style={{ backgroundColor: getTypeColor(type) }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Quick info */}
          <div className="modal-info-grid">
            <div className="info-card slide-in-left">
              <div className="info-label">Height</div>
              <div className="info-value">{heightM}m</div>
            </div>
            <div className="info-card slide-in-right">
              <div className="info-label">Weight</div>
              <div className="info-value">{weightKg}kg</div>
            </div>
            <div className="info-card slide-in-left" style={{ animationDelay: '0.1s' }}>
              <div className="info-label">Base EXP</div>
              <div className="info-value">{baseExp}</div>
            </div>
            <div className="info-card slide-in-right" style={{ animationDelay: '0.1s' }}>
              <div className="info-label">Abilities</div>
              <div className="info-value">{abilities.length}</div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <div className="modal-section-title">⚔️ Base Stats</div>
            {stats.map(stat => (
              <StatBar key={stat.stat.name} stat={stat} />
            ))}
          </div>

          {/* Abilities */}
          {abilities.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div className="modal-section-title">✨ Abilities</div>
              <div className="abilities-wrap">
                {abilities.map(a => (
                  <span
                    key={a.ability.name}
                    className={`ability-chip ${a.is_hidden ? 'hidden-ability' : ''}`}
                    title={a.is_hidden ? 'Hidden ability' : ''}
                  >
                    {a.ability.name} {a.is_hidden ? '(Hidden)' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Moves */}
          {moves.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div className="modal-section-title">🌀 Moves (first 20)</div>
              <div className="moves-wrap">
                {moves.map(m => (
                  <span key={m.move.name} className="move-chip">
                    {m.move.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sprites row */}
          {pokemon.sprites && (
            <div style={{ marginTop: '20px' }}>
              <div className="modal-section-title">🎨 Sprites</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                {[
                  pokemon.sprites.front_default,
                  pokemon.sprites.back_default,
                  pokemon.sprites.front_shiny,
                  pokemon.sprites.back_shiny,
                ].filter(Boolean).map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`sprite ${idx}`}
                    style={{
                      width: 64,
                      height: 64,
                      imageRendering: 'pixelated',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseOver={e => e.target.style.transform = 'scale(1.5)'}
                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  />
                ))}
                {pokemon.sprites.front_shiny && (
                  <span className="shiny-badge">✨ Shiny</span>
                )}
              </div>
            </div>
          )}

          {/* Favorite button */}
          <button
            className={`modal-fav-btn ${isFav ? 'active' : ''}`}
            onClick={() => onToggleFav(pokemon.id)}
          >
            {isFav ? '⭐ Remove from Favorites' : '☆ Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PokemonModal
