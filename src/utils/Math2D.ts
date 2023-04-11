import { Particle } from "../models/Particle"

export const getDistanceBetweenParticles = (a: Particle, b: Particle): number => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

export const getDistanceBetweenPoints = (x1: number, y1: number, x2: number, y2: number): number => {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

export const angleBetweenParticles = (a: Particle, b: Particle): number => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.atan2(dy, dx)
}

export const angleBetweenPoints = (x1: number, y1: number, x2: number, y2: number): number => {
  const dx = x2 - x1
  const dy = y2 - y1
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

