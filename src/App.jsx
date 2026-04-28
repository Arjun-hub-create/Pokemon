import React, { useState, useEffect, useRef, useCallback, useDeferredValue } from 'react'
import JungleBackground from './components/JungleBackground'
import TreeScene from './components/TreeScene'
import HeroSection from './components/HeroSection'
import BgFloaters from './components/BgFloaters'
import FloatingParticles from './components/FloatingParticles'
import ScrollProgressBar from './components/ScrollProgressBar'
import StatsBar from './components/StatsBar'
import PokemonCard from './components/PokemonCard'
import PokemonModal from './components/PokemonModal'
import TypeFilters from './components/TypeFilters'
import Pagination from './components/Pagination'
import Toast from './components/Toast'
import FavoritesView from './components/FavoritesView'
import {
  usePokemonList,
  useFilteredPokemon,
  useFavorites,
  useToast,
} from './hooks/usePokemon'
import { useScrollReveal } from './hooks/useScroll'

function App() {
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [showFavorites, setShowFavorites] = useState(false)
  const [pagesSeen, setPagesSeen] = useState(1)

  const deferredSearch = useDeferredValue(search)

  const { allPokemon, loading: listLoading, error: listError } = usePokemonList()
  const {
    cards, totalCount, totalPages, loading: pageLoading, error: pageError,
  } = useFilteredPokemon(allPokemon, deferredSearch, selectedTypes, currentPage)
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const { toast, showToast } = useToast()

  const gridRef = useRef(null)
  const [filterRef, filterVisible] = useScrollReveal()

  useEffect(() => {
    setPagesSeen(prev => Math.max(prev, currentPage))
  }, [currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [deferredSearch, selectedTypes])

  // Scroll reveal for grid cards
  useEffect(() => {
    if (!gridRef.current) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    const items = gridRef.current.querySelectorAll('.reveal')
    items.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [cards])

  const handleToggleFav = useCallback((pokemonId) => {
    const wasAlready = isFavorite(pokemonId)
    toggleFavorite(pokemonId)
    showToast(wasAlready ? '💔 Removed from favorites' : '⭐ Added to favorites!')
  }, [isFavorite, toggleFavorite, showToast])

  function handlePageChange(page) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isLoading = listLoading || pageLoading
  const error = listError || pageError

  return (
    <>
      <JungleBackground />
      <TreeScene />
      <BgFloaters />
      <FloatingParticles />
      <ScrollProgressBar />
      <HeroSection onExplore={() => {}} />

      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="logo-pokeball">⚡</span>
            <span className="logo-text">AJ PokéDex Lite</span>
          </div>

          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search Pokémon..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search Pokémon by name"
            />
          </div>

          <div className="header-controls">
            <button
              className={`favorites-btn ${showFavorites ? 'active' : ''}`}
              onClick={() => setShowFavorites(v => !v)}
              aria-pressed={showFavorites}
            >
              ⭐ Favorites
              {favorites.length > 0 && (
                <span className="count-badge" style={{ marginLeft: 4 }}>
                  {favorites.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {showFavorites ? (
          <FavoritesView
            favoriteIds={favorites}
            isFavorite={isFavorite}
            onToggleFav={handleToggleFav}
            onCardClick={setSelectedPokemon}
            onBack={() => setShowFavorites(false)}
          />
        ) : (
          <>
            <StatsBar totalFavs={favorites.length} totalSeen={pagesSeen} />

            <div
              ref={filterRef}
              className={`reveal-section ${filterVisible ? 'in-view' : ''}`}
            >
              <TypeFilters selected={selectedTypes} onChange={setSelectedTypes} />
            </div>

            {!isLoading && !error && (
              <div className="results-info">
                Showing <span>{cards.length}</span> of <span>{totalCount}</span> Pokémon
                {selectedTypes.length > 0 && ` · ${selectedTypes.join(' + ')} type`}
                {deferredSearch && ` · "${deferredSearch}"`}
              </div>
            )}

            {isLoading && (
              <div className="loading-container">
                <span className="pokeball-emoji">🌀</span>
                <div className="loading-text">Loading Pokémon...</div>
              </div>
            )}

            {!isLoading && error && (
              <div className="error-container">
                <span className="error-emoji">😵</span>
                <div className="error-text">Something went wrong in the jungle!</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{error}</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            )}

            {!isLoading && !error && cards.length === 0 && (
              <div className="empty-state">
                <span className="empty-emoji">🌿</span>
                <div className="empty-text">No Pokémon found in this jungle!</div>
                <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: '0.9rem' }}>
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {!isLoading && !error && cards.length > 0 && (
              <div className="pokemon-grid" ref={gridRef}>
                {cards.map((pokemon, idx) => (
                  <div key={pokemon.id} className="reveal">
                    <PokemonCard
                      pokemon={pokemon}
                      isFav={isFavorite(pokemon.id)}
                      onToggleFav={handleToggleFav}
                      onClick={setSelectedPokemon}
                      cardIndex={idx}
                    />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          isFav={isFavorite(selectedPokemon.id)}
          onToggleFav={handleToggleFav}
          onClose={() => setSelectedPokemon(null)}
        />
      )}

      <Toast message={toast.msg} visible={toast.visible} />
    </>
  )
}

export default App
