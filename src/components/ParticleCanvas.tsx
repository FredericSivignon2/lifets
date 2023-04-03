// src/components/ParticleCanvas.tsx

import React, { useRef, useEffect, useState } from 'react'
import { useAnimationFrame } from '../hooks/useAnimationFrame'
import { FormData, NeighborInfo, Particle, ParticleCanvasProps } from './types'

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
          particle.x,
          particle.y,
          formData.particuleRadius,
          0,
          2 * Math.PI
        )
        // console.log('X=' + particle.x + ' - Y=' + particle.y)
        ctx.fillStyle = particle.color
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

const updateParticles = (previousParticles: Particle[], 
                        formData: FormData,
                        width: number,
                        height: number ): Particle[] => {
  previousParticles.forEach((particle) => {
    return updateParticle(
      formData,
      particle,
      previousParticles,
      width,
      height
    )
  })

  return previousParticles
}

function updateParticle(
  formData: FormData,
  particle: Particle,
  previousParticles: Particle[],
  width: number,
  height: number
) {
  // console.log(
  //   '(5) Updating particle: ' +
  //     JSON.stringify(particle) +
  //     ' - width: ' +
  //     width +
  //     ' - height: ' +
  //     height
  // )

  var neighbordInfo = getHemisphereNeighborsInfo(
    formData,
    particle,
    previousParticles
  )

  //console.log('   neighbordInfo: ' + JSON.stringify(neighbordInfo))

  if (neighbordInfo.neighborNumber > 0) {
    particle.orientation += neighbordInfo.needToTurnLeft
      ? particle.behavior
      : -particle.behavior
  }

  particle.color = getColorByNeighborNumber(neighbordInfo.neighborNumber)

  // Convert the angle from degrees to radians
  const angleRadians = (particle.orientation * Math.PI) / 180

  // Calculate the new velocity components
  const dx = Math.cos(angleRadians) * particle.v
  const dy = Math.sin(angleRadians) * particle.v

  // console.log('   dx, dy: ' + dx + ', ' + dy)

  particle.x += dx
  particle.y += dy
  particle.orientation = (particle.orientation + 180) % 360

  // If the particle is out of the canvas bounds, wrap it around
  if (particle.x < 0) particle.x = width
  if (particle.x > width) particle.x = 0
  if (particle.y < 0) particle.y = height
  if (particle.y > height) particle.y = 0

  //console.log('(6) Particle updated: ' + JSON.stringify(particle))
  return particle
}

const generateRandomParticles = (
  data: FormData,
  width: number,
  height: number
): Particle[] => {
  console.log('Generating ' + data.numberOfParticles + ' particles using width=' + width + ' and height=' + height)
  return Array.from({ length: data.numberOfParticles }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    orientation: 0,
    v: data.speed * data.particuleRadius,
    alpha: 180,
    behavior: 5.17,
    color: 'green',
  }))
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
