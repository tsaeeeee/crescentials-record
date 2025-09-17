import { useEffect, useId, useRef } from 'react'

export function AboutSection() {
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveCanvasId = useId()

  useEffect(() => {
    // Wave animation implementation from homepage
    function createWaveAnimation(canvas: HTMLCanvasElement, color = '#FFD900') {
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      let phases: number[] = []
      let shadowPhases: number[] = []
      let t = 0
      const waveResolution = 50

      function resizeCanvas() {
        // Use full viewport width for canvas, but we'll position waves on right side only
        canvas.width = window.innerWidth
        canvas.height = 200
      }

      function initPhases() {
        phases = []
        shadowPhases = []
        
        // On mobile, generate phases for full width; on desktop, only right half
        const isMobile = window.innerWidth <= 768
        const waveWidth = isMobile ? canvas.width : canvas.width / 2
        
        for (let x = 0; x < waveWidth; x += waveResolution) {
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
        
        // On mobile, draw across full width; on desktop, only right half
        const isMobile = window.innerWidth <= 768
        const startX = isMobile ? 0 : canvas.width / 2
        
        ctx.moveTo(startX, canvas.height / 2 + yOffset)

        for (let i = 0; i < phaseArray.length; i++) {
          const x = startX + (i * waveResolution)
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
      // Small delay to ensure DOM is ready, especially on mobile
      const timer = setTimeout(() => {
        if (waveCanvasRef.current) {
          const cleanup = createWaveAnimation(waveCanvasRef.current)
          return cleanup
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <div className="about-container">
        <div className="about-left"></div>
        <div className="about-right">
          <div className="about-inner">
            <img
              src="/assets/images/Crescentials Record - Horizontal.png"
              alt="Crescentials Record Logo"
              className="about-img"
            />
            <p className="about-paragraph">
              <span style={{ fontWeight: 'bold' }}>Crescentials Record</span>, a home-based music production studio since 2019, based in Indonesia, providing services for individuals who want to create their own single, as well as those who wish to develop their own EP/album.
            </p>
            <p className="about-paragraph">
              <span style={{ fontWeight: 'bold' }}>We</span>, always aim to deliver the highest quality of music persona while maintaining affordable pricing for our services and packages.
            </p>
          </div>
        </div>
      </div>
      <canvas
        id={waveCanvasId}
        ref={waveCanvasRef}
        className="wave-canvas-about"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '200px',
          pointerEvents: 'none',
          zIndex: 2,
          margin: 0,
          padding: 0,
          border: 0,
          outline: 0,
          boxSizing: 'border-box',
          display: 'block',
        }}
      />
    </>
  )
}