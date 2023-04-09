import { QuadTree } from "js-quadtree"

export interface ParticleCanvasProps {
  width: number
  height: number
  formData: FormData
}

export interface NeighborInfo {
  needToTurnLeft: boolean
  neighborNumber: number
}

export interface EnvironmentData {
  formData: FormData
  quadTree: QuadTree
  width: number
  height: number
  maxParticleRadius: number
}

export interface Particle {
  /**
   * The particule identifier
   */
  id: number,
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
   * Mass
   */
  m: number,
  /**
   * Particule size
   */
  radius: number,
  /**
   * Particule color
   */
  color: string,
  /**
   * An array of particules ids to determine
   * other particles that currently interract 
   * with this one
   */
  interactionParticles: number[]
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

