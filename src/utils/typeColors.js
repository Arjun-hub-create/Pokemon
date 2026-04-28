export const TYPE_COLORS = {
  fire: '#ff6b35',
  water: '#4fc3f7',
  grass: '#66bb6a',
  electric: '#fdd835',
  psychic: '#f06292',
  ice: '#80deea',
  dragon: '#7c4dff',
  dark: '#5d4037',
  poison: '#ab47bc',
  ground: '#a1887f',
  rock: '#90a4ae',
  bug: '#9ccc65',
  ghost: '#7e57c2',
  steel: '#78909c',
  fairy: '#f48fb1',
  fighting: '#ef5350',
  normal: '#bdbdbd',
  flying: '#b39ddb',
}

export function getTypeColor(type) {
  return TYPE_COLORS[type] || '#4caf50'
}

export const ALL_TYPES = Object.keys(TYPE_COLORS)

export const STAT_COLORS = {
  hp: '#ef5350',
  attack: '#ff7043',
  defense: '#42a5f5',
  'special-attack': '#ab47bc',
  'special-defense': '#26c6da',
  speed: '#66bb6a',
}
