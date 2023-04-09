import { FormData, Particle } from "../components/types"

export const createDefaultFormData = (): FormData => {
    return {
        numberOfParticles: 1000,
        reactionRadius: 5,
        speed: 0.67,
        particuleRadius: 8
    }
}

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
    data: FormData,
    width: number,
    height: number
  ): Particle[] => {
    return Array.from({ length: data.numberOfParticles }, (_, i: number) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      a: Math.random() * 2 * Math.PI,
      v: 1,
      m: 1,
      radius: 4 + Math.random() * 20,
      color: getRandomColor(),
      interactionParticles: [],
    }))
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