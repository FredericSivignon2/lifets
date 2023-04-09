// src/App.tsx

import React, { ComponentProps, useState } from 'react'
import { Global, css } from '@emotion/react'
import styled, { StyledComponent } from '@emotion/styled'
import useResizeObserver from '@react-hook/resize-observer'
import ParticleForm from './components/ParticleForm'
import ParticleCanvas from './components/ParticleCanvas'
import { FormData, Size, ParticleCanvasProps } from './components/types'
import { createDefaultFormData } from './utils/factory'

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(createDefaultFormData())

  const handleFormSubmit = (submittedData: FormData) => {
    setFormData(submittedData)
  }

  const useSize = (target: React.RefObject<HTMLElement>): Size | undefined => {
    console.log('(2) *** Enter useSize.')

    const [size, setSize] = React.useState<Size>()

    React.useLayoutEffect(() => {
      if (target.current) {
        console.log('(3) *** client rect= ' + target.current.getBoundingClientRect())
        setSize(target.current.getBoundingClientRect())
      }
    }, [target])

    // Where the magic happens
    useResizeObserver(target, (entry) => setSize(entry.contentRect))
    return size
  }

  const target = React.useRef<HTMLDivElement>(null)
  const size = useSize(target)

  console.log('(1) *** Size: ' + JSON.stringify(size))

  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
              'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
              'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
              monospace;
          }
        `}
      />
      <Container>
        <LeftPanel>
          <ParticleForm onFormSubmit={handleFormSubmit} />
        </LeftPanel>
        <div ref={target} style={{ flex: 3, backgroundColor: 'white' }}>
          <ParticleCanvas
            width={size ? size.width : 300}
            height={size ? size.height : 200}
            formData={formData}
          />
        </div>
      </Container>
    </>
  )
}

const Container = styled.div`
  display: flex;
  height: 100vh;
`

const LeftPanel = styled.div`
  flex: 1;
  background-color: #f0f0f0;
  padding: 1rem;
`

const RightPanel = styled.div`
  flex: 3;
  background-color: #ffffff;
  padding: 1rem;
`

export default App
