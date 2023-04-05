
export interface ParticleCanvasProps {
  width: number
  height: number
  formData: FormData
}

export interface NeighborInfo {
  needToTurnLeft: boolean
  neighborNumber: number
}

export interface Particle {
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
  v: number
  /**
   * Angle (direction)
   */
  a: number,
  /**
   * Particule size
   */
  radius: number,
  /**
   * Particule color
   */
  color: string
}

export interface Size {
  width: number
  height: number
}

export interface FormData {
  /**
   * The total number of particles in the screen
   */
  numberOfParticles: number
  /**
   * The radius used to considere particles neighbors
   */
  reactionRadius: number
  /**
   * Determines the particule speed
   */
  speed: number
  /**
   * Determines each particule size
   */
  particuleRadius: number
}

export const createDefaultFormData = (): FormData => {
    return {
        numberOfParticles: 1000,
        reactionRadius: 5,
        speed: 0.67,
        particuleRadius: 8
    }
}
