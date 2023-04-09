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

export const goToOppositeDirection = (particle: Particle): void => {
      particle.a = (particle.a + Math.PI) % (2 * Math.PI)
}

export const resolveElasticCollision = (particle1: Particle, particle2: Particle): void => {
  let vx1 = particle1.v * Math.cos(particle1.a)
  let vy1 = particle1.v * Math.sin(particle1.a)
  let vx2 = particle2.v * Math.cos(particle2.a)
  let vy2 = particle2.v * Math.sin(particle2.a)

  // Calculate the collision normal (unit vector)
  const deltaX = particle2.x - particle1.x
  const deltaY = particle2.y - particle1.y
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  const normalX = deltaX / distance
  const normalY = deltaY / distance

  // Compute the relative velocity along the collision normal
  const relativeVelocityX = vx2 - vx1
  const relativeVelocityY = vy2 - vy1
  const relativeVelocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY

  // Do not resolve the collision if the circles are moving away from each other
  if (relativeVelocityAlongNormal > 0) {
      return
  }

  // Calculate the impulse scalar using the coefficient of restitution (elastic collision)
  const coefficientOfRestitution = 1; // For a perfectly elastic collision
  const impulseScalar = -(1 + coefficientOfRestitution) * relativeVelocityAlongNormal / (1 / particle1.m + 1 / particle2.m)

  // Apply the impulse to both circles
  const impulseX = impulseScalar * normalX
  const impulseY = impulseScalar * normalY
  vx1 -= impulseX / particle1.m
  vy1 -= impulseY / particle1.m
  vx2 += impulseX / particle2.m
  vy2 += impulseY / particle2.m

  particle1.a = Math.atan2(vy1, vx1)
  particle2.a = Math.atan2(vy2, vx2)

  particle1.v = Math.sqrt(vx1 * vx1 + vy1 * vy1)
  particle2.v = Math.sqrt(vx2 * vx2 + vy2 * vy2)
}
