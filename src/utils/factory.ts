import { ParticleImpl } from '../components/ParticleImpl'
import { EnvironmentData, MainData, ParticleData } from '../components/types'
import { Particle } from '../models/Particle'
import { isNil } from './utils'

export const createDefaultParticleData = (): ParticleData => {
	return {
		speed: 1,
		volumicMass: 0.4,
		radius: 30,
		color: '#0000A0',
		numberOfParticles: 30,
		isSensitiveToMagnetism: false,
		isMagnetic: false,
		magneticForce: 0,
	}
}

export const createDefaultFormData = (): MainData => {
	return {
		coefficientOfRestitution: 1,
		particlesData: [
			{
				speed: 1,
				volumicMass: 0.4,
				radius: 30,
				color: '#0000A0',
				numberOfParticles: 30,
				isSensitiveToMagnetism: false,
				isMagnetic: false,
				magneticForce: 0,
			},
			{
				speed: 0.5,
				volumicMass: 0.5,
				radius: 40,
				color: '#2A9E00',
				numberOfParticles: 30,
				isSensitiveToMagnetism: false,
				isMagnetic: false,
				magneticForce: 0,
			},
			{
				speed: 1,
				volumicMass: 0.3,
				radius: 25,
				color: '#C91DA4',
				numberOfParticles: 50,
				isSensitiveToMagnetism: false,
				isMagnetic: false,
				magneticForce: 0,
			},
			{
				speed: 0.2,
				volumicMass: 0.4,
				radius: 90,
				color: '#C96A1D',
				numberOfParticles: 1,
				isSensitiveToMagnetism: false,
				isMagnetic: false,
				magneticForce: 0,
			},
		],
	}
}

// export const createDefaultFormData = (): MainData => {
//   return {
//     coefficientOfRestitution: 1,
//     particlesData:
//     [{
//       speed: 1,
//       volumicMass: 1,
//       radius: 40,
//       color: '#C96A1D',
//       numberOfParticles: 1,
//       isSensitiveToMagnetism: false,
//       isMagnetic: false,
//       magneticForce: 0
//     },
//     {
//       speed: 1.5,
//       volumicMass: 1,
//       radius: 80,
//       color: '#C91DA4',
//       numberOfParticles: 1,
//       isSensitiveToMagnetism: false,
//       isMagnetic: false,
//       magneticForce: 0
//     }
//   ]
//   }
// }

export const getQuadTreeConfig = () => {
	return {
		capacity: 4, // Specify the maximum amount of point per node (default: 4)
		removeEmptyNodes: true, // Specify if the quadtree has to remove subnodes if they are empty (default: false).
		maximumDepth: -1, // Specify the maximum depth of the quadtree. -1 for no limit (default: -1).
		// Specify a custom method to compare point for removal (default: (point1, point2) => point1.x === point2.x && point1.y === point2.y).
		// arePointsEqual: (point1, point2) => point1.data.foo === point2.data.foo
	}
}

export const generateRandomParticles = (
	envData: EnvironmentData,
	width: number,
	height: number
): Particle[] => {
	if (isNil(envData.formData.particlesData)) return []

	const result: Particle[] = []
	envData.formData.particlesData.forEach((particleData) => {
		return result.push(
			...Array.from({ length: particleData.numberOfParticles }, () => {
				return new ParticleImpl(
					envData,
					Math.random() * width,
					Math.random() * height,
					particleData.speed,
					Math.random() * 2 * Math.PI,
					particleData.radius,
					particleData.volumicMass,
					particleData.isSensitiveToMagnetism,
					particleData.isMagnetic,
					particleData.magneticForce,
					particleData.color
				)
			})
		)
	})

	return result
}

export const getRandomColor = (): string => {
	const colorNumber = Math.round(Math.random() * 5)

	switch (colorNumber) {
		case 0:
			return 'green'
		case 1:
			return 'black'
		case 2:
			return 'orange'
		case 3:
			return 'red'
		case 4:
			return 'purple'
		default:
			return 'blue'
	}
}
