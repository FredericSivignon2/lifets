// src/components/ParticleCanvas.tsx

import React, { useRef, useEffect, useState } from 'react'
import { useAnimationFrame } from '../hooks/useAnimationFrame'
import { FormData, NeighborInfo, Particle, ParticleCanvasProps } from './types'
import p5Types from 'p5'

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
  const p5 = p5.

  console.log('ParticleCanvas starting, width=' + width + ' - height=' + height)


  const nextAnimationFrameHandler = (width: number, height: number): void => {
    // console.log('(2) useEffect() -> Rendering particles: ' + particlesRef.current.length)

    if (particlesRef.current === undefined) return

    updateParticles(particlesRef.current, formData, width, height)

    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height)

      particlesRef.current.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(
          particle.position.x,
          particle.position.y,
          formData.particuleRadius,
          0,
          2 * Math.PI
        )
        // console.log('X=' + particle.x + ' - Y=' + particle.y)
        ctx.fillStyle = particle.color.toString()
        ctx.fill()
      })
    }

    drawParticles()
  }

  // console.log('Before useAnimationFrame, Width=' + widthRef.current + ' - height=' + heightRef.current)
  useAnimationFrame((width, height) => {
    nextAnimationFrameHandler(width, height)
  }, width, height)

  useEffect(() => {
    console.log(
      '(1) useEffect() -> Initializing particles (' +
        formData.numberOfParticles +
        ' particles) with width=' + width + ' - height=' + height
    )
    particlesRef.current = generateRandomParticles(formData, width, height)
    console.log(
      '(1B) Particles generated: ' + JSON.stringify(particlesRef.current)
    )
  }, [formData, width, height])

  return <canvas ref={canvasRef} width={width} height={height} />
}

export default ParticleCanvas


const generateRandomParticles = (
  data: FormData,
  width: number,
  height: number
): Particle[] => {
  console.log('Generating ' + data.numberOfParticles + ' particles using width=' + width + ' and height=' + height)
  return Array.from({ length: data.numberOfParticles }, () => {
    new Particle(p)
  })
}

const getColorByNeighborNumber = (neighborNumber: number): string => {
  switch (neighborNumber) {
    case 0:
      return 'green'
    case 1:
      return 'yellow'
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

const getHemisphereNeighborsInfo = (
  data: FormData,
  particle: Particle,
  particles: Particle[]
): NeighborInfo => {
  const neighbors = particles.filter((otherParticle) => {
    if (particle === otherParticle) return false
    const dx = otherParticle.x - particle.x
    const dy = otherParticle.y - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance <= data.reactionRadius
  })

  let positiveAnglesCount = 0
  let negativeAnglesCount = 0

  neighbors.forEach((neighbor) => {
    const dx = neighbor.x - particle.x
    const dy = neighbor.y - particle.y
    const angle = Math.atan2(dy, dx)

    if (angle >= 0) {
      positiveAnglesCount++
    } else {
      negativeAnglesCount++
    }
  })

  return {
    neighborNumber: positiveAnglesCount + negativeAnglesCount,
    needToTurnLeft: positiveAnglesCount >= negativeAnglesCount,
  }
}
