import { useState, useEffect, useCallback } from 'react'

const POKEMON_PER_PAGE = 20
const BASE_URL = 'https://pokeapi.co/api/v2'

// In-memory cache so we don't re-fetch the same pokemon over and over
const detailsCache = {}
// Cache for type -> pokemon name sets (from the /type endpoint)
const typeNameCache = {}

async function fetchPokemonDetail(nameOrId) {
  const key = String(nameOrId)
  if (detailsCache[key]) return detailsCache[key]
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`)
  if (!res.ok) throw new Error(`Failed to fetch pokemon ${nameOrId}`)
  const data = await res.json()
  // Store under both id and name for easy lookup
  detailsCache[String(data.id)] = data
  detailsCache[data.name] = data
  return data
}

// Fetch all pokemon names that belong to a given type using /type endpoint
// This is accurate and avoids brute-force fetching all pokemon details
async function fetchNamesByType(typeName) {
  if (typeNameCache[typeName]) return typeNameCache[typeName]
  const res = await fetch(`${BASE_URL}/type/${typeName}`)
  if (!res.ok) throw new Error(`Failed to fetch type ${typeName}`)
  const data = await res.json()
  const nameSet = new Set(data.pokemon.map(entry => entry.pokemon.name))
  typeNameCache[typeName] = nameSet
  return nameSet
}

// Hook: full pokemon list (names only — just 649 entries, very fast)
export function usePokemonList() {
  const [allPokemon, setAllPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let canceled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        // Gen 1-5 is 649 pokemon — a nice manageable range
        const res = await fetch(`${BASE_URL}/pokemon?limit=649&offset=0`)
        if (!res.ok) throw new Error('Could not load the Pokémon list')
        const data = await res.json()
        if (!canceled) {
          setAllPokemon(
            data.results.map((p, i) => ({
              name: p.name,
              url: p.url,
              id: i + 1,
            }))
          )
          setLoading(false)
        }
      } catch (err) {
        if (!canceled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }
    load()
    return () => { canceled = true }
  }, [])

  return { allPokemon, loading, error }
}

// Hook: applies search + type filters then paginates and fetches full details
// for just the current page (20 pokemon). Type filtering uses the /type API
// endpoint which returns correct data without fetching every pokemon.
export function useFilteredPokemon(allPokemon, search, selectedTypes, page) {
  const [cards, setCards] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadPage = useCallback(async () => {
    if (allPokemon.length === 0) return

    setLoading(true)
    setError(null)

    try {
      let filtered = allPokemon

      // Step 1: name search — no network needed, just filter the list
      if (search.trim()) {
        const query = search.toLowerCase().trim()
        filtered = filtered.filter(p => p.name.includes(query))
      }

      // Step 2: type filter — use /type/:name endpoint (accurate, cached)
      if (selectedTypes.length > 0) {
        // Get the name-sets for each selected type in parallel
        const typeSets = await Promise.all(
          selectedTypes.map(t => fetchNamesByType(t))
        )
        // Keep only pokemon that appear in ALL selected type sets
        filtered = filtered.filter(p =>
          typeSets.every(nameSet => nameSet.has(p.name))
        )
      }

      setTotalCount(filtered.length)

      // Step 3: slice to the current page
      const startIdx = (page - 1) * POKEMON_PER_PAGE
      const pageSlice = filtered.slice(startIdx, startIdx + POKEMON_PER_PAGE)

      // Step 4: fetch full details only for this page's 20 pokemon
      const pageDetails = await Promise.all(
        pageSlice.map(p => fetchPokemonDetail(p.id).catch(() => null))
      )

      setCards(pageDetails.filter(Boolean))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [allPokemon, search, selectedTypes, page])

  useEffect(() => {
    loadPage()
  }, [loadPage])

  const totalPages = Math.ceil(totalCount / POKEMON_PER_PAGE)

  return { cards, totalCount, totalPages, loading, error }
}

// Hook: single pokemon detail
export function usePokemonDetail(nameOrId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!nameOrId) return
    let canceled = false
    async function load() {
      try {
        setLoading(true)
        const detail = await fetchPokemonDetail(nameOrId)
        if (!canceled) {
          setData(detail)
          setLoading(false)
        }
      } catch (err) {
        if (!canceled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }
    load()
    return () => { canceled = true }
  }, [nameOrId])

  return { data, loading, error }
}

// Hook: favorites with localStorage
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('pokedex-favorites')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const toggleFavorite = useCallback((pokemonId) => {
    setFavorites(prev => {
      const id = Number(pokemonId)
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem('pokedex-favorites', JSON.stringify(next))
      return next
    })
  }, [])

  const isFavorite = useCallback((pokemonId) => {
    return favorites.includes(Number(pokemonId))
  }, [favorites])

  return { favorites, toggleFavorite, isFavorite }
}

// Hook: toast notification
export function useToast() {
  const [toast, setToast] = useState({ visible: false, msg: '' })

  const showToast = useCallback((msg) => {
    setToast({ visible: true, msg })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2200)
  }, [])

  return { toast, showToast }
}
