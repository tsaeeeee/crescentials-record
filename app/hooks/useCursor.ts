import { useEffect } from 'react'

export function useCursor() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const winWidth = window.innerWidth
      const winHeight = window.innerHeight

      const mouseX = Math.round((e.pageX / winWidth) * 100)
      const mouseY = Math.round((e.pageY / winHeight) * 100)

      document.body.style.setProperty('--mouse-x', `${mouseX}%`)
      document.body.style.setProperty('--mouse-y', `${mouseY}%`)
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
}
