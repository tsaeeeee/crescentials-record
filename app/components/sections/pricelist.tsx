import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'
import { usePricelist } from '~/hooks/usePricelist'

export function PricelistSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { pricelist, loading, error } = usePricelist()

  useEffect(() => {
    const container = containerRef.current
    if (!container || loading || error || !pricelist.length) return

    container.innerHTML = `
      <div class="left">
        <div class="title-zone">
          <div class="title">Pick Your Packages</div>
        </div>
        <div class="picker-zone">
          <div class="picker" id="picker">
            ${pricelist.map(item => `<div class="picker-item">${item.name}</div>`).join('')}
          </div>
        </div>
      </div>
      <div class="right">
        <div id="details"></div>
        <div class="notes" id="notes">
          *Terms and conditions apply. Kindly contact us for custom projects. <br>
          *50% upfront payment required, with the remaining balance upon delivery. <br>
          *Standard delivery time is 7–14 working days depending on complexity.
        </div>
      </div>
    `

    const picker = document.getElementById('picker')
    const items = Array.from(document.querySelectorAll('.picker-item')) as HTMLElement[]
    const detailsBox = document.getElementById('details')
    const notes = document.getElementById('notes')

    const detailsData = pricelist.map(item => ({
      price: item.price.display,
      points: item.features,
    }))

    let currentIndex = 0
    let isAnimating = false

    function updatePicker() {
      items.forEach((item, i) => {
        const diff = Math.abs(i - currentIndex)
        if (diff === 0) {
          item.style.opacity = '1'
          item.style.transform = 'scale(1.1)'
        } else if (diff === 1) {
          item.style.opacity = '0.5'
          item.style.transform = 'scale(1)'
        } else if (diff === 2) {
          item.style.opacity = '0.15'
          item.style.transform = 'scale(0.95)'
        } else {
          item.style.opacity = '0'
          item.style.transform = 'scale(0.9)'
        }
      })
    }

    function updateDetails(index: number) {
      const data = detailsData[index]
      const html = `
        <h1 class="price">${data.price}</h1>
        <ul>
          ${data.points.map(p => `<li>${p}</li>`).join('')}
        </ul>
      `

      if (detailsBox) {
        gsap.to(detailsBox, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            detailsBox.innerHTML = html
            const elements = detailsBox.querySelectorAll('h1, li')
            gsap.set(elements, { opacity: 0, y: -20 })
            gsap.to(detailsBox, { opacity: 1, duration: 0.2 })
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: 'power2.out',
            })
          },
        })
      }
    }

    function movePicker(direction: number) {
      if (isAnimating) return
      const newIndex = currentIndex + direction
      if (newIndex >= 0 && newIndex < items.length) {
        currentIndex = newIndex
        isAnimating = true
        updateDetails(currentIndex)
        if (picker) {
          gsap.to(picker, {
            y: -currentIndex * 115,
            duration: 0.4,
            ease: 'power3.out',
            onUpdate: updatePicker,
            onComplete: () => {
              isAnimating = false
            },
          })
        }
      }
    }

    window.addEventListener('wheel', (e: WheelEvent) => {
      if (e.deltaY > 0) movePicker(1)
      else movePicker(-1)
    })

    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        if (i !== currentIndex) {
          currentIndex = i
          updateDetails(currentIndex)
          if (picker) {
            gsap.to(picker, {
              y: -currentIndex * 100,
              duration: 0.4,
              ease: 'power3.out',
              onUpdate: updatePicker,
              onComplete: () => {
                isAnimating = false
              },
            })
          }
        }
      })
    })

    updatePicker()
    updateDetails(currentIndex)

    if (notes) {
      gsap.fromTo(
        notes,
        { opacity: 0, y: 20 },
        { opacity: 0.9, y: 0, duration: 1, ease: 'power2.out', delay: 0.5 },
      )
    }
  }, [pricelist, loading, error])

  if (loading) return <div>Loading pricing information...</div>
  if (error) return <div>Error loading pricing: {error}</div>

  return <div ref={containerRef} className="pricelist-container" />
}
