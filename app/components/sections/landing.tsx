import { useEffect, useId, useRef } from 'react'

export const LandingSection = () => {
  const taglineRef = useRef<HTMLHeadingElement>(null)
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const taglineId = useId()
  const waveCanvasId = useId()

  useEffect(() => {
    // 1. Tagline flicker animation
    if (taglineRef.current) {
      const taglineLines = taglineRef.current.querySelectorAll('.tagline-line')

      taglineLines.forEach(line => {
        const text = line.textContent || ''
        line.textContent = ''

        // Split text into characters and wrap in spans
        Array.from(text).forEach(char => {
          const span = document.createElement('span')
          if (char === ' ') {
            span.innerHTML = '&nbsp;'
          } else {
            span.textContent = char
            span.classList.add('flicker-char')
            span.style.setProperty('--delay', (Math.random() * 3).toFixed(3))
          }
          line.appendChild(span)
        })
      })
    }

    // 2. Original wave animation
    function createWaveAnimation(canvas: HTMLCanvasElement, color = '#FFD900') {
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      let phases: number[] = []
      let shadowPhases: number[] = []
      let t = 0
      const waveResolution = 50

      function resizeCanvas() {
        canvas.width = window.innerWidth
        canvas.height = 200
      }

      function initPhases() {
        phases = []
        shadowPhases = []
        for (let x = 0; x < canvas.width; x += waveResolution) {
          phases.push(Math.random() * Math.PI * 2)
          shadowPhases.push(Math.random() * Math.PI * 2)
        }
      }

      function drawWave(
        phaseArray: number[],
        yOffset: number,
        waveColor: string,
        amplitude = 15,
        alpha = 1,
      ) {
        if (!ctx) return

        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2 + yOffset)

        for (let i = 0; i < phaseArray.length; i++) {
          const x = i * waveResolution
          const y =
            Math.sin(t + phaseArray[i]) *
            amplitude *
            (0.6 + Math.sin(phaseArray[i] * 3 + t * 0.2) * 0.4)
          ctx.lineTo(x, canvas.height / 2 + y + yOffset)
        }

        ctx.lineTo(canvas.width, canvas.height / 2 + yOffset)
        ctx.strokeStyle = waveColor
        ctx.globalAlpha = alpha
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      function animate() {
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawWave(shadowPhases, -40, 'rgba(255, 217, 0, 0.4)', 20, 0.4)
        drawWave(phases, -40, color, 18, 1)
        t += 0.03
        requestAnimationFrame(animate)
      }

      resizeCanvas()
      initPhases()
      animate()

      const handleResize = () => {
        resizeCanvas()
        initPhases()
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }

    if (waveCanvasRef.current) {
      const cleanup = createWaveAnimation(waveCanvasRef.current)
      return cleanup
    }
  }, [])

  return (
    <>
      <div className="logo-container">
        <h1 className="tagline" id={taglineId} ref={taglineRef}>
          <span className="tagline-line">Create Music </span>
          <span className="tagline-line">with Essentials.</span>
        </h1>
      </div>
      <canvas
        className="wave-canvas"
        id={waveCanvasId}
        ref={waveCanvasRef}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '200px',
          pointerEvents: 'none',
          zIndex: 2,
          margin: 0,
          padding: 0,
          border: 0,
          outline: 0,
          boxSizing: 'border-box',
        }}
      />
    </>
  )
}
