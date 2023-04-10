import { Circle, Point } from 'js-quadtree'
import { Particle } from '../models/Particle'
import { EnvironmentData } from './types'
import { getDistanceBetween } from '../utils/Math2D'

export const updateParticles = (
	particles: Particle[],
	envData: EnvironmentData
): Particle[] => {
	envData.quadTree.clear()
	envData.quadTree.insert(getPointsFromParticles(particles))

	particles.forEach((particle) => {
		const points = envData.quadTree.query(
			new Circle(particle.x, particle.y, envData.height / 8)
		)

		if (particle.isSensitiveToMagnetism) {
			particle.applyMagneticForces(getParticlesFromPoints(points))
		}

		particle.move()
	})

	checkCollisions(particles, envData)

	return particles
}

export const getPointsFromParticles = (particles: Particle[]): Point[] => {
	return particles.map((particle) => {
		return new Point(particle.x, particle.y, particle)
	})
}

export const getParticlesFromPoints = (points: Point[]): Particle[] => {
	return points.map((point) => {
		return point.data
	})
}

const checkCollisions = (particles: Particle[], envData: EnvironmentData) => {
	envData.quadTree.clear()
	envData.quadTree.insert(getPointsFromParticles(particles))

	particles.forEach((particle) => {
		const points = envData.quadTree.query(
			new Circle(particle.x, particle.y, envData.maxParticleRadius * 3)
		)

		if (points && points !== undefined && points.length > 1) {
			points.forEach((point) => {
				if (point.x === particle.x && point.y === particle.y) {
					return
				}

				const otherParticle = point.data
				const distance = getDistanceBetween(particle, otherParticle)

				// Collision?
				if (distance > particle.radius + otherParticle.radius) {
					return
				}
				// Now, modify particle direction if there is a collision
				particle.resolveElasticCollision(otherParticle)

				// envData.audio.pause()
				// envData.audio.play()
			})
		}
	})
}
