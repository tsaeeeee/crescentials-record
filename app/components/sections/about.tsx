import { useId } from 'react'

export function AboutSection() {
  const waveCanvasId = useId()

  return (
    <section id="About" className="section about-section">
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
              Crescentials Record adalah label musik independen yang berdedikasi untuk menghadirkan 
              artis-artis berbakat dengan suara autentik dan inovatif. Kami berkomitmen untuk 
              mendukung kreativitas musisi dalam mengekspresikan karya mereka, mulai dari proses 
              produksi hingga distribusi yang luas.
            </p>
            <p className="about-paragraph">
              Dengan pengalaman dan passion di industri musik, Crescentials Record menjadi jembatan 
              antara artis dan pendengar, menciptakan pengalaman musik yang bermakna dan berkesan 
              untuk semua kalangan.
            </p>
          </div>
        </div>
      </div>
      <canvas 
        id={waveCanvasId}
        className="wave-canvas-about"
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
    </section>
  )
}