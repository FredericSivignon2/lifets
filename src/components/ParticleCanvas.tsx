import React, { useRef, useEffect } from 'react'
import { useAnimationFrame } from '../hooks/useAnimationFrame'
import {
	EnvironmentData,
	ParticleCanvasProps,
} from './types'
import { Box, QuadTree } from 'js-quadtree'
import { angleBetweenPoints, getDistanceBetweenPoints } from '../utils/Math2D'
import { generateRandomParticles, getQuadTreeConfig } from '../utils/factory'
import { Particle } from '../models/Particle'
import ball_sound from '../sounds/ball_sound_01.wav'
import { updateParticles } from './ParticleBehavior'

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
	width,
	height,
	formData,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const particlesRef = useRef<Particle[]>([])
	const envDataRef = useRef<EnvironmentData>()
	const selectedParticle = useRef<Particle | null>()
	

	const findParticleUnderCursor = (x: number, y: number) => {
		return particlesRef.current.find((particle) => {
			const dx = x - particle.x
			const dy = y - particle.y
			const distance = Math.sqrt(dx * dx + dy * dy)
			return distance <= particle.radius
		})
	}

	const handleMouseDown = (event: React.MouseEvent) => {
		const rect = canvasRef.current?.getBoundingClientRect()
		if (rect === undefined) return

		const x = event.clientX - rect.left
		const y = event.clientY - rect.top

		const particle = findParticleUnderCursor(x, y)
		if (particle) {
			selectedParticle.current = particle
			console.log('*** (1) Mouse down. Selected Particle ID: ' + particle.id)
		}
	}

	const handleMouseMove = (event: React.MouseEvent) => {
		if (selectedParticle.current) {
			const rect = canvasRef.current?.getBoundingClientRect()
			if (rect === undefined) return

			const x = event.clientX - rect.left
			const y = event.clientY - rect.top

			const prevX = selectedParticle.current.x
			const prevY = selectedParticle.current.y

			selectedParticle.current.x = x
			selectedParticle.current.y = y

			selectedParticle.current.speed = getDistanceBetweenPoints(prevX, prevY, x, y)
			selectedParticle.current.angle = angleBetweenPoints(prevX, prevY, x, y)
			console.log('*** (2) Selected Particle speed: ' + selectedParticle.current.speed)
		}
	}

	const handleMouseUp = () => {
		console.log('*** (3) Mouse up. Selected Particle ID: ' + selectedParticle.current?.id)
		selectedParticle.current = null
	}

	const nextAnimationFrameHandler = (width: number, height: number): void => {
		if (particlesRef.current === undefined || envDataRef.current === undefined)
			return

		console.log('*** (4) Selected Particle ID: ' + selectedParticle.current?.id)
		const currentTime = performance.now()
		envDataRef.current.deltaTime =
			currentTime - envDataRef.current.lastUpdateTime
		updateParticles(particlesRef.current, envDataRef.current, selectedParticle.current ? selectedParticle.current : null)

		if (!canvasRef.current) return
		
		const ctx = canvasRef.current.getContext('2d')
		if (!ctx) return

		const drawParticles = () => {
			ctx.clearRect(0, 0, width, height)

			particlesRef.current.forEach((particle) => {
				ctx.beginPath()
				ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI)

				if (particle.radius < 8) {
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
					)

					// Define gradient colors and stops
					gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
					gradient.addColorStop(0.95, particle.color.toString())
					gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)')

					// Use the gradient as the fill style
					ctx.fillStyle = gradient
				}
				ctx.fill()
			})
		}

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
		envDataRef.current = {
			formData: formData,
			quadTree: new QuadTree(boundingArea, getQuadTreeConfig()),
			width: width,
			height: height,
			maxParticleRadius: 0,
			lastUpdateTime: performance.now(),
			deltaTime: 0,
			audio: new Audio(ball_sound),
		}

		if (envDataRef.current !== undefined) {
			particlesRef.current = generateRandomParticles(
				envDataRef.current,
				width,
				height
			)
			envDataRef.current.maxParticleRadius = Math.max(
				...particlesRef.current.map((particle) => particle.radius)
			)
			envDataRef.current.audio.loop = false
		}
	}, [formData, width, height])

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
		/>
	)
}

export default ParticleCanvas
function useMutableRef<T>(arg0: null) {
	throw new Error('Function not implemented.')
}

