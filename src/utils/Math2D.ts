import { Particle } from "../models/Particle"

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

export const goToOppositeDirection = (particle: Particle): void => {
      particle.angle = (particle.angle + Math.PI) % (2 * Math.PI)
}

export const velocitiesToSpeedAndAngle = (vx: number, vy: number): { speed: number; angle: number } => {
  const speed = Math.sqrt(vx * vx + vy * vy);
  const angle = Math.atan2(vy, vx);
  return { speed, angle };
}

