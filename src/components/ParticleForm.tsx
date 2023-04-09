// src/components/ParticleForm.tsx

import React, { useState } from "react"
import styled from "@emotion/styled"
import { FormData } from "./types"
import { createDefaultFormData } from "../utils/factory";

interface ParticleFormProps {
  onFormSubmit: (formData: FormData) => void;
}

const ParticleForm: React.FC<ParticleFormProps> = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState<FormData>(createDefaultFormData());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('New value for \'' + e.target.name + '\' = ' + e.target.value)
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
        <label htmlFor="particulRadius">Particles radius:</label>
        <input
          type="number"
          name="particulRadius"
          value={formData.particuleRadius}
          onChange={handleChange}
        />
      </FormField>
      <FormField>
        <label htmlFor="speed">Particles speed:</label>
        <input
          type="number"
          name="speed"
          value={formData.speed}
          onChange={handleChange}
        />
      </FormField>
      <FormField>
        <label htmlFor="reactionRadius">Reaction radius:</label>
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
