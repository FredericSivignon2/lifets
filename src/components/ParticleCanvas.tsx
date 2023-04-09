// src/components/ParticleCanvas.tsx

import React, { useRef, useEffect, useState } from 'react'
import { useAnimationFrame } from '../hooks/useAnimationFrame'
import { EnvironmentData, FormData, NeighborInfo, Particle, ParticleCanvasProps } from './types'
import { Box, Circle, Point, QuadTree } from 'js-quadtree'
import { angleBetweenPoints, getDistanceBetween, resolveElasticCollision } from '../utils/Math2D'
import { generateRandomParticles, getQuadTreeConfig } from '../utils/factory'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  width,
  height,
  formData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const widthRef = useRef<number>(width)
  const heightRef = useRef<number>(height)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const envDataRef = useRef<EnvironmentData>()

  // FOR DEBUG ONLY
  // width = 60
  // height = 40

  const nextAnimationFrameHandler = (width: number, height: number): void => {
    // console.log('(2) useEffect() -> Rendering particles: ' + particlesRef.current.length)

    if (particlesRef.current === undefined || envDataRef.current === undefined)
      return

    updateParticles(
      particlesRef.current,
      envDataRef.current
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

    

    const boundingArea = new Box(0, 0, width, height)
    particlesRef.current = generateRandomParticles(formData, width, height)
    envDataRef.current = 
      {
        formData: formData,
        quadTree: new QuadTree(boundingArea, getQuadTreeConfig()),
        width: width,
        height: height,
        maxParticleRadius: Math.max(...particlesRef.current.map(particle => particle.radius))
      }      

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
  envData: EnvironmentData
): Particle[] => {
  particles.forEach((particle) => {
    return updateParticlePosition(
      particle,
      particles,
      envData
    )
  })

  checkCollisions(particles, envData)

  return particles
}

const moveParticle = (particle: Particle, envData: EnvironmentData) => {
  const dx = particle.v * Math.cos(particle.a)
  const dy = particle.v * Math.sin(particle.a)

  particle.x += dx
  particle.y += dy

  if (particle.x >= envData.width) {
    particle.x = envData.width
    particle.a = Math.PI - particle.a
  }
  if (particle.x <= 0) {
    particle.x = 0
    particle.a = Math.PI - particle.a
  }
  if (particle.y >= envData.height) {
    particle.y = envData.height
    particle.a = -particle.a
  }
  if (particle.y <= 0) {
    particle.y = 0
    particle.a = -particle.a
  }
}

const updateParticlePosition = (
  particle: Particle,
  previousParticles: Particle[],
  envData: EnvironmentData
): Particle => {
  // updateParticleFromNeighbor()

  moveParticle(particle, envData)

  return particle

  function updateParticleFromNeighbor() {
    const points = envData.quadTree.query(new Circle(particle.x, particle.y, 400))
    if (points && points !== undefined && points.length > 1) {
      points.forEach((point) => {
        if (point.x === particle.x && point.y === particle.y) {
          return
        }

        const otherParticle = point.data
        const angleBetween = angleBetweenPoints(particle, otherParticle)
        const angleDiff = angleBetween - particle.a

        const distance = getDistanceBetween(particle, otherParticle)
        if (distance < particle.radius * 2) return

        if (otherParticle.m > 0) {
          particle.a = (particle.a + (angleDiff * 2) / distance) % (2 * Math.PI)
          particle.v += otherParticle.m / distance
          if (particle.v > 2) particle.v = 2
        }
      })
    }
  }
}

const checkCollisions = (
  particles: Particle[],
  envData: EnvironmentData
) => {
  envData.quadTree.clear()
  envData.quadTree.insert(getPointsFromParticles(particles))

  particles.forEach((particle) => {
    // console.log('>>> Processing particle id ' + particle.id)
    
    const points = envData.quadTree.query(
      new Circle(particle.x, particle.y, envData.maxParticleRadius * 3)
    )

    //  console.log('     ' + (points && points != undefined ? points.length : 0) + ' points found: ' + JSON.stringify(points))

    if (points && points !== undefined && points.length > 1) {
     
      points.forEach((point) => {
        if (point.x === particle.x && point.y === particle.y) {
          return
        }

        const otherParticle = point.data
        
        if (
          particle.interactionParticles.includes(otherParticle.id) ||
          otherParticle.interactionParticles.includes(particle.id)
        ) {
          // console.log('      > Already processed.')
          return
        }
        let distance = getDistanceBetween(particle, otherParticle)
        // console.log('      > Distance between particles: ' + distance)

        // Collision?
        if (distance > particle.radius + otherParticle.radius) {
          // console.log('      > Distance too high. No collision.')
          return
        }
        // Now, modify particle direction if there is a collision
        // const angleBetween = angleBetweenPoints(particle, otherParticle)
        // console.log('*** Angle between particles: ' + angleBetween)

        // console.log('      > Distance too low. COLLISION !!!')
        resolveElasticCollision(particle, otherParticle)

        
        // Swap the velocities along the line of impact
        // const newVelocityA =
        //   otherParticle.v * Math.cos(otherParticle.a - angleBetween)
        // const newVelocityB = particle.v * Math.cos(particle.a - angleBetween)

        // const previousA = particle.a // TO REMOVE
        // particle.a = Math.atan2(
        //   particle.v * Math.sin(particle.a - angleBetween) +
        //     newVelocityA * Math.cos(angleBetween),
        //   newVelocityA * Math.sin(angleBetween)
        // )
        // console.log('*** Particle angle from ' + previousA + ' to ' + particle.a)
        // particle.interactionParticles.push(otherParticle.id)

        // const previousB = otherParticle.a // TO REMOVE
        // otherParticle.a = Math.atan2(
        //   otherParticle.v * Math.sin(otherParticle.a - angleBetween) +
        //     newVelocityB * Math.cos(angleBetween),
        //   newVelocityB * Math.sin(angleBetween)
        // )
        // console.log('*** Other particle angle from ' + previousB + ' to ' + otherParticle.a)
        // otherParticle.interactionParticles.push(particle.id)

        

        // while (distance < (particle.radius * 2) || distance < (otherParticle.radius * 2)) {
        //   if (particle.a.toFixed(2) === otherParticle.a.toFixed(2)) {
        //     particle.a = -particle.a
        //   }

        //   console.log('>>> Distance too low: ' + distance)
        //   moveParticle(particle, width, height)
        //   // moveParticle(otherParticle, width, height)
        //   distance = getDistanceBetween(particle, otherParticle)
        //   console.log('   >>> Distance updated to: ' + distance)
        //   console.log('   >>> Dump particle: ' + JSON.stringify(particle))
        //   console.log('   >>> Dump other particle: ' + JSON.stringify(otherParticle))
        // }
        //CALCULER LES ANGLES POUR LES 2 PARTICULES EN INTERACTION ET VOIR A NE PAS REEXUTER LE TEST
        //A NOUVEAU (variable "traité" dans chaque particule. Mais comment traiter plusieurs interractions ?)

        // particle.a = (particle.a - angleBetween) % (2 * Math.PI)
        // particle.v -= 0.1
        // if (particle.v < 0) particle.v = 0
      })

      // particle.color = 'red'
    }
  })

  // Reset particles interraction information
  particles.forEach((particle) => {
    particle.interactionParticles = []
  })
}

