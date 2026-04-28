import React, { useMemo } from 'react'

const JUMPERS = [
  { id: 25, name: 'pikachu' },
  { id: 390, name: 'chimchar' },
  { id: 252, name: 'treecko' },
  { id: 190, name: 'aipom' },
  { id: 56, name: 'mankey' },
  { id: 163, name: 'hoothoot' },
]

function TreeScene() {
  const trees = useMemo(() => {
    return [
      { id: 0, left: '6%', height: 220, delay: 0, canopySize: 130 },
      { id: 1, left: '22%', height: 280, delay: 0.3, canopySize: 160 },
      { id: 2, left: '40%', height: 200, delay: 0.6, canopySize: 120 },
      { id: 3, left: '58%', height: 260, delay: 0.2, canopySize: 150 },
      { id: 4, left: '76%', height: 240, delay: 0.5, canopySize: 140 },
      { id: 5, left: '90%', height: 210, delay: 0.1, canopySize: 125 },
    ]
  }, [])

  const jumpers = useMemo(() => {
    return JUMPERS.map((p, i) => ({
      ...p,
      fromTree: i % trees.length,
      toTree: (i + 1 + Math.floor(i / 2)) % trees.length,
      duration: 3.5 + (i * 0.6) % 3,
      delay: i * 2.2,
      size: 40 + (i * 5) % 20,
    }))
  }, [trees.length])

  return (
    <div className="tree-scene" aria-hidden="true">
      {/* Trees */}
      {trees.map(tree => (
        <div
          key={tree.id}
          className="jungle-tree"
          style={{
            left: tree.left,
            '--tree-height': `${tree.height}px`,
            '--canopy-size': `${tree.canopySize}px`,
            '--tree-delay': `${tree.delay}s`,
          }}
        >
          {/* Trunk */}
          <div className="tree-trunk" />
          {/* Canopy layers */}
          <div className="tree-canopy canopy-1" />
          <div className="tree-canopy canopy-2" />
          <div className="tree-canopy canopy-3" />
          {/* Leaves falling from tree */}
          <div className="tree-leaf tree-leaf-1">🍃</div>
          <div className="tree-leaf tree-leaf-2">🌿</div>
        </div>
      ))}

      {/* Jumping Pokémon */}
      {jumpers.map((jumper, i) => {
        const fromTree = trees[jumper.fromTree]
        const toTree = trees[jumper.toTree]
        return (
          <img
            key={jumper.id}
            className="tree-jumper"
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${jumper.id}.png`}
            alt=""
            style={{
              '--jump-from-x': fromTree.left,
              '--jump-to-x': toTree.left,
              '--jump-from-y': `${fromTree.height - 40}px`,
              '--jump-to-y': `${toTree.height - 40}px`,
              '--jump-duration': `${jumper.duration}s`,
              '--jump-delay': `${jumper.delay}s`,
              '--jumper-size': `${jumper.size}px`,
              '--jump-idx': i,
            }}
          />
        )
      })}
    </div>
  )
}

export default TreeScene
