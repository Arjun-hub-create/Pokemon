import React from 'react'
import { getTypeColor } from '../utils/typeColors'

function getPokemonImage(pokemon) {
  return (
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  )
}

function PokemonCard({ pokemon, isFav, onToggleFav, onClick, cardIndex }) {
  const types = pokemon.types?.map(t => t.type.name) || []
  const primaryType = types[0] || 'normal'
  const typeColor = getTypeColor(primaryType)
  const imgSrc = getPokemonImage(pokemon)

  function handleFavClick(e) {
    e.stopPropagation()
    onToggleFav(pokemon.id)
  }

  return (
    <div
      className="pokemon-card"
      onClick={() => onClick(pokemon)}
      style={{
        '--type-color': `${typeColor}33`,
        '--card-delay': `${Math.min(cardIndex * 0.05, 0.6)}s`,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(pokemon)}
      aria-label={`View details for ${pokemon.name}`}
    >
      <button
        className={`fav-btn ${isFav ? 'active' : ''}`}
        onClick={handleFavClick}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFav ? '⭐' : '☆'}
      </button>

      <div className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</div>

      <div className="pokemon-img-wrap">
        <div className="pokemon-shadow" />
        <img
          className="pokemon-img"
          src={imgSrc}
          alt={pokemon.name}
          loading="lazy"
          onError={e => {
            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
          }}
        />
      </div>

      <div className="pokemon-name">{pokemon.name}</div>

      <div className="type-badges">
        {types.map(type => (
          <span
            key={type}
            className="type-badge"
            style={{ backgroundColor: getTypeColor(type) }}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PokemonCard
