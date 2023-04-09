import styled from '@emotion/styled'

export const FormField = styled.div`
    background-color: #C0D0FF;
  display: grid;
  grid-template-columns: min-content 0.9fr 0.1fr;
  grid-gap: 1rem;
  margin-bottom: 0px;

  label {
    width: 150px; // You can adjust this value to fit the largest label
    text-align: right;
    padding-right: 0.2rem;
  }
`
