import React, { useState, useEffect } from 'react'
import PokemonCard from './PokemonCard'

const BASE_URL = 'https://pokeapi.co/api/v2'

function FavoritesView({ favoriteIds, isFavorite, onToggleFav, onCardClick, onBack }) {
  const [favPokemon, setFavPokemon] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setFavPokemon([])
      setLoading(false)
      return
    }
    let canceled = false
    async function load() {
      setLoading(true)
      try {
        const results = await Promise.all(
          favoriteIds.map(id =>
            fetch(`${BASE_URL}/pokemon/${id}`).then(r => r.json()).catch(() => null)
          )
        )
        if (!canceled) {
          setFavPokemon(results.filter(Boolean))
          setLoading(false)
        }
      } catch {
        if (!canceled) setLoading(false)
      }
    }
    load()
    return () => { canceled = true }
  }, [favoriteIds])

  return (
    <div>
      <div className="view-toggle-bar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>⭐ Favorites</h2>
        <span className="count-badge">{favoriteIds.length}</span>
      </div>

      {loading && (
        <div className="loading-container">
          <span className="pokeball-emoji">🌟</span>
          <div className="loading-text">Loading Favorites...</div>
        </div>
      )}

      {!loading && favPokemon.length === 0 && (
        <div className="favorites-empty">
          <span className="empty-emoji">🌿</span>
          <div className="empty-text">No favorites yet!</div>
          <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: '0.9rem' }}>
            Star a Pokémon to save it here
          </p>
        </div>
      )}

      {!loading && favPokemon.length > 0 && (
        <div className="pokemon-grid">
          {favPokemon.map((pokemon, idx) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isFav={isFavorite(pokemon.id)}
              onToggleFav={onToggleFav}
              onClick={onCardClick}
              cardIndex={idx}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesView
