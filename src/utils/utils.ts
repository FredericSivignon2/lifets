import { Point } from 'js-quadtree'
import { Particle } from '../models/Particle'

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const isNil = (a: any): boolean => a === null || a === undefined

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
