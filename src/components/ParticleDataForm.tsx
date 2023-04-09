import React, { useState } from 'react'
import { ParticleDataFormProps } from './types'
import { FormField } from './StyledFields'

export const ParticleDataForm: React.FC<ParticleDataFormProps> = ({
  particleData,
  onRemove,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    onChange({ ...particleData, [name]: value })
  }

  return (
    <>
    <hr/>
      <FormField>
        <label htmlFor="color">Particle&nbsp;</label>
        <input
          type="color"
          name="color"
          value={particleData.color}
          onChange={handleChange}
        />
      </FormField>
      <FormField>
        <label htmlFor="speed">Speed:</label>
        <input
          type="number"
          name="speed"
          value={particleData.speed}
          onChange={handleChange}
        />
      </FormField>
      <FormField>
        <label htmlFor="volumicMass">Volumic mass:</label>
        <input
          type="number"
          name="volumicMass"
          value={particleData.volumicMass}
          onChange={handleChange}
        />
      </FormField>
      <FormField>
        <label htmlFor="radius">Radius:</label>
        <input
          type="number"
          name="radius"
          value={particleData.radius}
          onChange={handleChange}
        />
      </FormField>
      
      <FormField>
        <label htmlFor="numberOfParticles">Number of particles:</label>
        <input
          type="number"
          name="numberOfParticles"
          value={particleData.numberOfParticles}
          onChange={handleChange}
        />
      </FormField>
      <button onClick={onRemove}>Remove</button>
    </>
  )
}
