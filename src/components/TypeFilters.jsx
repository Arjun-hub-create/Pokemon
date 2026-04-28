import React from 'react'
import { ALL_TYPES, getTypeColor } from '../utils/typeColors'

function TypeFilters({ selected, onChange }) {
  function handleChipClick(type) {
    if (type === 'all') {
      onChange([])
      return
    }
    if (selected.includes(type)) {
      onChange(selected.filter(t => t !== type))
    } else {
      onChange([...selected, type])
    }
  }

  return (
    <div className="type-filter-section">
      <div className="type-filter-title">🌿 Filter by Type</div>
      <div className="type-filter-grid">
        <button
          className={`type-chip all-chip ${selected.length === 0 ? 'selected' : ''}`}
          onClick={() => handleChipClick('all')}
          style={{ '--chip-color': '#a5d6a7' }}
        >
          All
        </button>
        {ALL_TYPES.map(type => (
          <button
            key={type}
            className={`type-chip ${selected.includes(type) ? 'selected' : ''}`}
            onClick={() => handleChipClick(type)}
            style={{ '--chip-color': getTypeColor(type) }}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TypeFilters
