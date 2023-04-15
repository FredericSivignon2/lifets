import { EnvironmentData } from '../components/types'
import { velocitiesToSpeedAndAngle } from '../utils/Math2D'

export interface Particle {
	readonly envData: EnvironmentData
	/**
	 * The particule identifier
	 */
	readonly id: number
	/**
	 * x position
	 */
	x: number
	/**
	 * y position
	 */
	y: number
	/**
	 * Speed
	 */
	speed: number
	/**
	 * Angle (direction)
	 */
	angle: number
	/**
	 * Mass
	 */
	mass: number
	/**
	 * Volumic mass
	 */
	volumicMass: number
	/**
	 * Determines whether this particle is sensitive
	 * to other magnetic particles
	 */
	isSensitiveToMagnetism: boolean
	/**
	 * Determines whether this particle is magnetic,
	 * so if it can influence (attract or repulse)
	 * the other particles sensitive to magnetism
	 */
	isMagnetic: boolean
	/**
	 * Only available if isMagnetic is true.
	 * Deterlines the magnetic force of ti
	 */
	magneticForce: number
	/**
	 * Particule size
	 */
	radius: number
	/**
	 * Particule color
	 */
	color: string,
	requestedAngle: number,
	requestedSpeed: number

	move(useRequested: boolean): void
	applyMagneticForces(particles: Particle[]): void
	resolveElasticCollision(otherParticle: Particle): void
}
