import React, { useRef, useEffect, useState } from 'react'
import { useAnimationFrame } from '../hooks/useAnimationFrame'
import { EnvironmentData, MainData, NeighborInfo, ParticleCanvasProps } from './types'
import { Box, Circle, Point, QuadTree } from 'js-quadtree'
import { angleBetweenPoints, getDistanceBetween } from '../utils/Math2D'
import { generateRandomParticles, getQuadTreeConfig } from '../utils/factory'
import { Particle } from '../models/Particle'
import { playSound } from '../utils/sound'
import ball_sound from "../sounds/ball_sound_01.wav"
import { updateParticles } from './ParticleBehavior'

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  width,
  height,
  formData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const envDataRef = useRef<EnvironmentData>()

  const nextAnimationFrameHandler = (width: number, height: number): void => {

    if (particlesRef.current === undefined || envDataRef.current === undefined)
      return

    const currentTime = performance.now()
    envDataRef.current.deltaTime = currentTime - envDataRef.current.lastUpdateTime
    updateParticles(
      particlesRef.current,
      envDataRef.current
    )

    if (!canvasRef.current) return
      performance.now
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
    
      particlesRef.current.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
    
        if (particle.radius < 4) {
          ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI)
          ctx.fillStyle = particle.color.toString()
        } else {
          // Create a radial gradient for the bubble
          const gradient = ctx.createRadialGradient(
            particle.x - particle.radius / 4,
            particle.y - particle.radius / 4,
            0,
            particle.x,
            particle.y,
            particle.radius
          );
      
          // Define gradient colors and stops
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          gradient.addColorStop(0.95, particle.color.toString());
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
      
          // Use the gradient as the fill style
          ctx.fillStyle = gradient;
        }
        ctx.fill();
      });
    };


    drawParticles()
  }

  useAnimationFrame(
    (width, height) => {
      nextAnimationFrameHandler(width, height)
    },
    width,
    height
  )

  useEffect(() => {

    const boundingArea = new Box(0, 0, width, height)
    envDataRef.current = 
    {
      formData: formData,
      quadTree: new QuadTree(boundingArea, getQuadTreeConfig()),
      width: width,
      height: height,
      maxParticleRadius: 0,
      lastUpdateTime: performance.now(),
      deltaTime: 0,
      audio: new Audio(ball_sound)
    }      

    if (envDataRef.current !== undefined) {
      particlesRef.current = generateRandomParticles(envDataRef.current, width, height)
      envDataRef.current.maxParticleRadius = Math.max(...particlesRef.current.map(particle => particle.radius))
      envDataRef.current.audio.loop = false
    }

  }, [formData, width, height])

  return <canvas ref={canvasRef} width={width} height={height} />
}

export default ParticleCanvas

