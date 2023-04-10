import { Particle } from '../models/Particle'
import { velocitiesToSpeedAndAngle } from '../utils/Math2D'
import { EnvironmentData } from './types'

export class ParticleImpl implements Particle {
	private static isSequence: number = 0

	readonly envData: EnvironmentData
	readonly id: number
	x: number
	y: number
	speed: number
	angle: number
	mass: number
	volumicMass: number
	isSensitiveToMagnetism: boolean
	isMagnetic: boolean
	magneticForce: number
	radius: number
	color: string

	constructor(
		envData: EnvironmentData,
		x: number,
		y: number,
		speed: number,
		angle: number,
		radius: number,
		volumicMass: number,
		isSensitiveToMagnetism: boolean,
		isMagnetic: boolean,
		magneticForce: number,
		color: string
	) {
		this.envData = envData
		this.id = ++ParticleImpl.isSequence
		this.x = x
		this.y = y
		this.speed = speed
		;(this.angle = angle), (this.radius = radius)
		this.volumicMass = volumicMass
		this.isSensitiveToMagnetism = isSensitiveToMagnetism
		this.isMagnetic = isMagnetic
		this.magneticForce = magneticForce
		this.mass = radius * radius * Math.PI * volumicMass
		this.color = color
	}

	move = (): void => {
		this.x += this.speed * Math.cos(this.angle)
		this.y += this.speed * Math.sin(this.angle)

		if (this.x + this.radius >= this.envData.width) {
			this.x = this.envData.width - this.radius
			this.angle = Math.PI - this.angle
		}
		if (this.x <= this.radius) {
			this.x = this.radius
			this.angle = Math.PI - this.angle
		}
		if (this.y + this.radius >= this.envData.height) {
			this.y = this.envData.height - this.radius
			this.angle = -this.angle
		}
		if (this.y <= this.radius) {
			this.y = this.radius
			this.angle = -this.angle
		}
	}

	applyMagneticForces = (particles: Particle[]): void => {
		let netForceX = 0
		let netForceY = 0

		particles.forEach((particle) => {
			if ((particle.x === this.x && 
                particle.y === this.y) ||
                particle.isMagnetic === false) return

			const deltaX = particle.x - this.x
			const deltaY = particle.y - this.y
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

			console.log('*** Distance: ' + distance)

			const forceMagnitude = this.gravitationalForce(
				this.mass,
				particle.mass,
				distance,
				0.00001 // gravitationalConstant
			)
			console.log('*** Force magnitude: ' + forceMagnitude)

			// Normalize the force vector
			const forceX = (deltaX / distance) * forceMagnitude
			const forceY = (deltaY / distance) * forceMagnitude

			netForceX += forceX
			netForceY += forceY
		})

		console.log('      >  netForceX: ' + netForceX)
		console.log('      >  netForceY: ' + netForceY)

		// Calculate the acceleration based on the net force and particle mass
		const accelerationX = netForceX / this.mass
		const accelerationY = netForceY / this.mass

		console.log('      >  accelerationX: ' + accelerationX)
		console.log('      >  accelerationY: ' + accelerationY)

		// Update the particle's velocity (vx, vy) based on speed and angle
		const vx = this.speed * Math.cos(this.angle)
		const vy = this.speed * Math.sin(this.angle)

		console.log('      >  vx: ' + vx)
		console.log('      >  vy: ' + vy)

		// Update the particle's velocity by adding the acceleration times the time step
		const newVx = vx + accelerationX * this.envData.deltaTime
		const newVy = vy + accelerationY * this.envData.deltaTime

		// Update the particle's speed and direction based on the new velocity
		const { speed, angle } = velocitiesToSpeedAndAngle(newVx, newVy)

		console.log('      >  speed: ' + speed)
		console.log('      >  angle: ' + angle)

		this.speed = speed
		this.angle = angle
	}

	resolveElasticCollision = (otherParticle: Particle): void => {
		let vx1 = this.speed * Math.cos(this.angle)
		let vy1 = this.speed * Math.sin(this.angle)
		let vx2 = otherParticle.speed * Math.cos(otherParticle.angle)
		let vy2 = otherParticle.speed * Math.sin(otherParticle.angle)

		// Calculate the collision normal (unit vector)
		const deltaX = otherParticle.x - this.x
		const deltaY = otherParticle.y - this.y
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
		const normalX = deltaX / distance
		const normalY = deltaY / distance

		// Compute the relative velocity along the collision normal
		const relativeVelocityX = vx2 - vx1
		const relativeVelocityY = vy2 - vy1
		const relativeVelocityAlongNormal =
			relativeVelocityX * normalX + relativeVelocityY * normalY

		// Do not resolve the collision if the circles are moving away from each other
		if (relativeVelocityAlongNormal > 0) {
			return
		}

		// Calculate the impulse scalar using the coefficient of restitution (elastic collision)
		const coefficientOfRestitution =
			this.envData.formData.coefficientOfRestitution // 1 for a perfectly elastic collision
		const impulseScalar =
			(-(1 + coefficientOfRestitution) * relativeVelocityAlongNormal) /
			(1 / this.mass + 1 / otherParticle.mass)

		// Apply the impulse to both circles
		const impulseX = impulseScalar * normalX
		const impulseY = impulseScalar * normalY
		vx1 -= impulseX / this.mass
		vy1 -= impulseY / this.mass
		vx2 += impulseX / otherParticle.mass
		vy2 += impulseY / otherParticle.mass

		this.angle = Math.atan2(vy1, vx1)
		otherParticle.angle = Math.atan2(vy2, vx2)

		const newSpeed1 = Math.sqrt(vx1 * vx1 + vy1 * vy1)

		this.speed = newSpeed1 > 2 ? 2 : newSpeed1

		const newSpeed2 = Math.sqrt(vx2 * vx2 + vy2 * vy2)
		otherParticle.speed = newSpeed2 > 2 ? 2 : newSpeed2
	}

	private gravitationalForce = (
		m1: number,
		m2: number,
		distance: number,
		gravitationalConstant: number
	): number => {
		return distance < this.radius
			? -(gravitationalConstant * m1 * m2) / (distance * distance)
			: (gravitationalConstant * m1 * m2) / (distance * distance)
	}
}
