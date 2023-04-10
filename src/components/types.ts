import { QuadTree } from 'js-quadtree'
import { velocitiesToSpeedAndAngle } from '../utils/Math2D'

export interface ParticleCanvasProps {
  width: number
  height: number
  formData: MainData
}

export interface NeighborInfo {
  needToTurnLeft: boolean
  neighborNumber: number
}

export interface EnvironmentData {
  formData: MainData
  quadTree: QuadTree
  width: number
  height: number
  maxParticleRadius: number
  /**
   * The last time particles have been updated and rendered
   */
  lastUpdateTime: number
  /**
   * The delta time between last particles update and now
   */
  deltaTime: number
  audio: any
}



export interface Size {
  width: number
  height: number
}

export interface ParticleData {
  speed: number
  volumicMass: number
  radius: number
  /**
   * Determines whether this particle is sensitive
   * to other magnetic particles
   */
  isSensitiveToMagnetism: boolean,
  /**
   * Determines whether this particle is magnetic,
   * so if it can influence (attract or repulse)
   * the other particles sensitive to magnetism
   */
  isMagnetic: boolean,
  /**
   * Only available if isMagnetic is true.
   * Deterlines the magnetic force of ti
   */
  magneticForce: number,
  color: string
  numberOfParticles: number
}

export interface MainData {
  /**
   * The coefficient of restitution, is the ratio of the final to initial 
   * relative speed between two objects after they collide.
   */
  coefficientOfRestitution: number
  particlesData: ParticleData[]
}

export interface ParticleDataFormProps {
  particleData: ParticleData
  onRemove: () => void
  onChange: (particleData: ParticleData) => void
}
