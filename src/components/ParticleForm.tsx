// src/components/ParticleForm.tsx

import React, { useState } from "react";
import styled from "@emotion/styled";

interface ParticleFormProps {
  onFormSubmit: (formData: FormData) => void;
}

export interface FormData {
  numberOfParticles: number;
  fixedAngle: number;
  reactionRadius: number;
}

const ParticleForm: React.FC<ParticleFormProps> = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    numberOfParticles: 0,
    fixedAngle: 0,
    reactionRadius: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormField>
        <label htmlFor="numberOfParticles">Number of Particles:</label>
        <input
          type="number"
          name="numberOfParticles"
          value={formData.numberOfParticles}
          onChange={handleChange}
        />
      </FormField>
      <FormField>
        <label htmlFor="fixedAngle">Fixed Angle (in degrees):</label>
        <input
          type="number"
          name="fixedAngle"
          value={formData.fixedAngle}
          onChange={handleChange}
        />
      </FormField>
      <FormField>
        <label htmlFor="reactionRadius">React to other particles in radius:</label>
        <input
          type="number"
          name="reactionRadius"
          value={formData.reactionRadius}
          onChange={handleChange}
        />
      </FormField>
      <button type="submit">Submit</button>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export default ParticleForm;
