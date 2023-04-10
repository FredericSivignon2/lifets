// src/components/ParticleForm.tsx

import React, { useState } from "react"
import styled from "@emotion/styled"
import { MainData, ParticleData } from "./types"
import { createDefaultFormData, createDefaultParticleData } from "../utils/factory"
import { ParticleDataForm } from "./ParticleDataForm"
import { FormField } from './StyledFields'

interface ParticleFormProps {
  onFormSubmit: (formData: MainData) => void;
}

const MainDataForm: React.FC<ParticleFormProps> = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState<MainData>(createDefaultFormData());

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({ 
      ...prevFormData, [name]: value }))
  }

  const handleParticleChange = (index: number, particleData: ParticleData) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      particlesData: prevFormData.particlesData.map((pd, i) =>
        i === index ? particleData : pd
      ),
    }));
  };

  const handleAdd = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      particlesData: [
        ...prevFormData.particlesData,
        createDefaultParticleData(),
      ],
    }));
  };

    const handleRemove = (index: number) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        particlesData: prevFormData.particlesData.filter(
          (_, i) => i !== index
        ),
      }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormField>
        <label htmlFor="coefficientOfRestitution">Coefficient of restitution:</label>
        <input
          type="range"
          min="0" // minimum value for the slider
          max="1" // maximum value for the slider
          step="0.1"
          name="coefficientOfRestitution"
          value={formData.coefficientOfRestitution}
          onChange={handleChange}
        />
        <span>{formData.coefficientOfRestitution}</span>
      </FormField>
      {formData.particlesData.map((particleData, index) => (
        <ParticleDataForm
          key={index}
          particleData={particleData}
          onRemove={() => handleRemove(index)}
          onChange={(pd) => handleParticleChange(index, pd)}
        />
      ))}
      <button onClick={handleAdd}>Add</button>
      <button type="submit">Submit</button>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  background-color: #F0A3E8;
  display: flex;
  flex-direction: column;
`;

export default MainDataForm;
