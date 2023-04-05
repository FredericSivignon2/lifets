// src/components/ParticleCanvas.tsx

import React, { useRef, useEffect, useState } from 'react'
import { useAnimationFrame } from '../hooks/useAnimationFrame'
import { FormData, NeighborInfo, Particle, ParticleCanvasProps } from './types'
import { Box, Circle, Point, QuadTree } from 'js-quadtree'
import { angleBetweenPoints, getDistanceBetween } from '../utils/Math2D'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  width,
  height,
  formData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  //const [particles, setParticles] = useState<Particle[]>([])
  const widthRef = useRef<number>(width)
  const heightRef = useRef<number>(height)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()

  // FOR DEBUG ONLY
  // width = 320
  // height = 200

  const quadTreeRef = useRef<QuadTree>()

  const nextAnimationFrameHandler = (width: number, height: number): void => {
    // console.log('(2) useEffect() -> Rendering particles: ' + particlesRef.current.length)

    if (particlesRef.current === undefined || quadTreeRef.current === undefined)
      return

    updateParticles(
      particlesRef.current,
      quadTreeRef.current,
      formData,
      width,
      height
    )

    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height)

      particlesRef.current.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI)
        // console.log('X=' + particle.x + ' - Y=' + particle.y)
        ctx.fillStyle = particle.color.toString()
        ctx.fill()
      })
    }

    drawParticles()
  }

  // console.log('Before useAnimationFrame, Width=' + widthRef.current + ' - height=' + heightRef.current)
  useAnimationFrame(
    (width, height) => {
      nextAnimationFrameHandler(width, height)
    },
    width,
    height
  )

  useEffect(() => {
    particlesRef.current = generateRandomParticles2(formData, width, height)

    const config = {
      capacity: 4, // Specify the maximum amount of point per node (default: 4)
      removeEmptyNodes: true, // Specify if the quadtree has to remove subnodes if they are empty (default: false).
      maximumDepth: 16, // Specify the maximum depth of the quadtree. -1 for no limit (default: -1).
      // Specify a custom method to compare point for removal (default: (point1, point2) => point1.x === point2.x && point1.y === point2.y).
      // arePointsEqual: (point1, point2) => point1.data.foo === point2.data.foo
    }
    const boundingArea = new Box(0, 0, width, height)
    quadTreeRef.current = new QuadTree(boundingArea, config)
  }, [formData, width, height])

  return <canvas ref={canvasRef} width={width} height={height} />
}

export default ParticleCanvas

const getPointsFromParticles = (particles: Particle[]): Point[] => {
  return particles.map((particle) => {
    return new Point(particle.x, particle.y, particle)
  })
}

const updateParticles = (
  particles: Particle[],
  quadTree: QuadTree,
  formData: FormData,
  width: number,
  height: number
): Particle[] => {
  particles.forEach((particle) => {
    return updateParticle(
      formData,
      particle,
      particles,
      quadTree,
      width,
      height
    )
  })

  checkCollisions(particles, quadTree, width, height)

  return particles
}


const updateParticle = (
  formData: FormData,
  particle: Particle,
  previousParticles: Particle[],
  quadTree: QuadTree,
  width: number,
  height: number
): Particle => {
  updateParticleFromNeighbor()

  const dx = particle.v * Math.cos(particle.a)
  const dy = particle.v * Math.sin(particle.a)

  particle.x += dx
  particle.y += dy

  if (particle.x >= width) {
    particle.x = width
    particle.a = Math.PI - particle.a
  }
  if (particle.x <= 0) {
    particle.x = 0
    particle.a = Math.PI - particle.a
  }
  if (particle.y >= height) {
    particle.y = height
    particle.a = -particle.a
  }
  if (particle.y <= 0) {
    particle.y = 0
    particle.a = -particle.a
  }

  return particle

  function updateParticleFromNeighbor() {
    const points = quadTree.query(new Circle(particle.x, particle.y, 100))
    if (points && points !== undefined && points.length > 1) {
      points.forEach((point) => {
        if (point.x === particle.x && point.y === particle.y) {
          return
        }
        const angleBetween = angleBetweenPoints(particle, point.data)
        const angleDiff = angleBetween - particle.a

        const distance = getDistanceBetween(particle, point.data)
        if (distance > 10) {
          particle.a = (particle.a + (angleDiff * 2 / distance)) % (2 * Math.PI)
          particle.v += 0.0001
        } else {
          particle.a = (particle.a - angleDiff * 0.2) % (2 * Math.PI)
          particle.v += 0.001
        }
        if (particle.v > 2)
          particle.v = 2
      })
    }
  }
}

const checkCollisions = (
  particles: Particle[],
  quadTree: QuadTree,
  width: number,
  height: number
) => {
  quadTree.clear()
  quadTree.insert(getPointsFromParticles(particles))

  particles.forEach((particle) => {
    const points = quadTree.query(
      new Circle(particle.x, particle.y, particle.radius * 2)
    )
    if (points && points !== undefined && points.length > 1) {
      // Reverse direction
      // particle.a = (particle.a + Math.PI) % (2 * Math.PI)
      points.forEach((point) => {
        if (point.x === particle.x && point.y === particle.y) {
          return
        }

        const angleBetween = angleBetweenPoints(particle, point.data)
        particle.a = (particle.a - angleBetween) % (2 * Math.PI)
        // particle.v -= 0.1
        if (particle.v < 0) particle.v = 0
      })

      // particle.color = 'red'
    }
  })
}

const generateRandomParticles2 = (
  data: FormData,
  width: number,
  height: number
): Particle[] => {
  
  return Array.from({ length: data.numberOfParticles }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    a: Math.random() * 2 * Math.PI,
    v: 0.3,
    radius: 4,
    color: getRandomColor(),
  }))
}

const getRandomColor = (): string => {
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

