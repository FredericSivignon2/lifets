import { Particle } from '../components/types'

export const getDistanceBetween = (a: Particle, b: Particle): number => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

export const angleBetweenPoints = (a: Particle, b: Particle): number => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.atan2(dy, dx)
}
