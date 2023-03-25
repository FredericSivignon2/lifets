// src/components/ParticleCanvas.tsx

import React, { useRef, useEffect, useState } from "react";
import { FormData } from "./ParticleForm";

interface ParticleCanvasProps {
  width: number;
  height: number;
  formData: FormData;
}

interface Particle {
  x: number;
  y: number;
}

const generateRandomParticles = (
  numberOfParticles: number,
  width: number,
  height: number
): Particle[] => {
  return Array.from({ length: numberOfParticles }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
  }));
};

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ width, height, formData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(generateRandomParticles(formData.numberOfParticles, width, height));
  }, [formData.numberOfParticles, width, height]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();
    });
  }, [particles, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default ParticleCanvas;
