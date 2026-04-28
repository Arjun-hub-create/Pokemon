import React, { useState, useEffect, useRef } from 'react'

// These are the starter pokemon IDs that will dance on the hero
const DANCING_POKEMON = [
  { id: 1, name: 'bulbasaur' },
  { id: 4, name: 'charmander' },
  { id: 7, name: 'squirtle' },
  { id: 25, name: 'pikachu' },
  { id: 39, name: 'jigglypuff' },
  { id: 133, name: 'eevee' },
]

// Trees for the hero background
const HERO_TREES = [
  { id: 0, left: '3%',  height: 180, canopySize: 100 },
  { id: 1, left: '14%', height: 240, canopySize: 130 },
  { id: 2, left: '28%', height: 160, canopySize: 90 },
  { id: 3, left: '70%', height: 200, canopySize: 110 },
  { id: 4, left: '82%', height: 250, canopySize: 140 },
  { id: 5, left: '93%', height: 170, canopySize: 95 },
]

// Pokemon jumping between trees in the hero
const HERO_JUMPERS = [
  { id: 252, name: 'treecko', from: 0, to: 1, dur: 3.2, delay: 0 },
  { id: 190, name: 'aipom',   from: 1, to: 2, dur: 3.8, delay: 1.5 },
  { id: 56,  name: 'mankey',  from: 3, to: 4, dur: 3.5, delay: 0.8 },
  { id: 390, name: 'chimchar',from: 4, to: 5, dur: 4.0, delay: 2.2 },
]

function HeroSection({ onExplore }) {
  const [loaded, setLoaded] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    // only show hero once per session
    return sessionStorage.getItem('hero-seen') === 'true'
  })
  const heroRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  function handleExplore() {
    sessionStorage.setItem('hero-seen', 'true')
    if (heroRef.current) {
      heroRef.current.classList.add('hero-exit')
    }
    setTimeout(() => {
      setDismissed(true)
      onExplore()
    }, 600)
  }

  if (dismissed) return null

  return (
    <div className={`hero-section ${loaded ? 'hero-loaded' : ''}`} ref={heroRef}>
      {/* Animated bg rings */}
      <div className="hero-rings">
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
      </div>

      {/* Hero Trees */}
      <div className="hero-tree-scene" aria-hidden="true">
        {HERO_TREES.map(tree => (
          <div
            key={tree.id}
            className="hero-jungle-tree"
            style={{
              left: tree.left,
              '--tree-height': `${tree.height}px`,
              '--canopy-size': `${tree.canopySize}px`,
              '--tree-delay': `${tree.id * 0.15}s`,
            }}
          >
            <div className="tree-trunk" />
            <div className="tree-canopy canopy-1" />
            <div className="tree-canopy canopy-2" />
            <div className="tree-canopy canopy-3" />
            <div className="tree-leaf tree-leaf-1">🍃</div>
            <div className="tree-leaf tree-leaf-2">🌿</div>
          </div>
        ))}

        {/* Jumping pokemon in hero */}
        {HERO_JUMPERS.map((jumper, i) => {
          const fromTree = HERO_TREES[jumper.from]
          const toTree = HERO_TREES[jumper.to]
          return (
            <img
              key={jumper.id}
              className="tree-jumper hero-jumper"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${jumper.id}.png`}
              alt=""
              style={{
                '--jump-from-x': fromTree.left,
                '--jump-to-x': toTree.left,
                '--jump-from-y': `${fromTree.height - 30}px`,
                '--jump-to-y': `${toTree.height - 30}px`,
                '--jump-duration': `${jumper.dur}s`,
                '--jump-delay': `${jumper.delay}s`,
                '--jumper-size': '42px',
              }}
            />
          )
        })}
      </div>

      {/* Pikachu "Arjun Is My Mentor" — top right */}
      <div className="pikachu-mentor">
        <div className="pikachu-speech-bubble">
          <span>Arjun Is My Mentor! ⚡</span>
        </div>
        <img
          className="pikachu-mentor-img"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          alt="Pikachu"
          draggable={false}
        />
      </div>

      {/* Title */}
      <div className="hero-title-wrap">
        <div className="hero-eyebrow">🌿 Welcome to the</div>
        <h1 className="hero-title">
          <span className="hero-title-aj">AJ</span>
          <span className="hero-title-poke"> Poké</span>
          <span className="hero-title-dex">Dex</span>
          <span className="hero-title-lite"> Lite</span>
        </h1>
        <p className="hero-subtitle">Explore 649 Pokémon from the jungle depths</p>
      </div>

      {/* Dancing pokemon row */}
      <div className="dancing-row">
        {DANCING_POKEMON.map((p, i) => (
          <div
            key={p.id}
            className="dancer-wrap"
            style={{ '--dance-delay': `${i * 0.18}s`, '--dance-idx': i }}
          >
            <img
              className="dancer-img"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
              alt={p.name}
              draggable={false}
            />
            <div className="dancer-shadow" />
            <div className="dancer-name">{p.name}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button className="hero-cta" onClick={handleExplore}>
        <span className="hero-cta-text">Enter the Jungle</span>
        <span className="hero-cta-arrow">→</span>
      </button>

      {/* Bottom grass decoration */}
      <div className="hero-grass">
        {'🌿🍃🌱🌿🍀🌿🍃🌱🌿🍀🌿🍃🌱🌿🍀🌿🍃'.split('').map((c, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.07}s` }}>{c}</span>
        ))}
      </div>
    </div>
  )
}

export default HeroSection
