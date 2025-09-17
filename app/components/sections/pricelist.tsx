import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'
import { usePricelist } from '~/hooks/usePricelist'

export function PricelistSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { pricelist, loading, error } = usePricelist()

  useEffect(() => {
    const container = containerRef.current
    if (!container || loading || error || !pricelist.length) return

    // Create the new structure with fixed viewport
    container.innerHTML = `
      <div class="left">
        <div class="title-zone">
          <div class="title">Pick Your Packages</div>
        </div>
        <div class="picker-zone">
          <div class="picker">
            <div class="picker-viewport">
              <div class="picker-list" id="picker-list">
                ${pricelist.map(item => `<div class="picker-item">${item.name}</div>`).join('')}
              </div>
            </div>
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

    const pickerList = document.getElementById('picker-list')
    const items = Array.from(document.querySelectorAll('.picker-item')) as HTMLElement[]
    const detailsBox = document.getElementById('details')
    const notes = document.getElementById('notes')

    const detailsData = pricelist.map(item => ({
      price: item.price.display,
      points: item.features,
    }))

    let currentIndex = 0
    let isAnimating = false

    const getItemHeight = () => {
      return window.innerWidth <= 1024 ? 75 : 100
    }

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

      const titleZone = document.querySelector('.title-zone') as HTMLElement
      if (titleZone && window.innerWidth <= 1024) {
        if (currentIndex === 0) {
          titleZone.classList.remove('hidden')
        } else {
          titleZone.classList.add('hidden')
        }
      }

      if (pickerList) {
        // Desktop: Use GSAP animation of entire picker for smoothness
        // Mobile: Use viewport positioning with transform
        if (window.innerWidth <= 1024) {
          const itemHeight = getItemHeight()
          const offset = -(currentIndex - 1) * itemHeight
          pickerList.style.transform = `translateY(${offset}px)`
        } else {
          // Desktop: Animate with GSAP for smooth movement
          // Adjust offset to center items better - use smaller spacing
          gsap.to(pickerList, {
            y: -currentIndex * 90,
            duration: 0.4,
            ease: 'power3.out',
          })
        }
      }
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

        if (window.innerWidth <= 1024) {
          // Mobile: Instant update with CSS transform
          updatePicker()
          setTimeout(() => {
            isAnimating = false
          }, 400)
        } else {
          // Desktop: Smooth GSAP animation
          if (pickerList) {
            gsap.to(pickerList, {
              y: -currentIndex * 90,
              duration: 0.4,
              ease: 'power3.out',
              onUpdate: updatePicker,
              onComplete: () => {
                isAnimating = false
              },
            })
          } else {
            updatePicker()
            setTimeout(() => {
              isAnimating = false
            }, 400)
          }
        }
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) movePicker(1)
      else movePicker(-1)
    }

    const handleResize = () => {
      const titleZone = document.querySelector('.title-zone') as HTMLElement
      if (titleZone) {
        if (window.innerWidth > 1024) {
          titleZone.classList.remove('hidden')
        } else {
          if (currentIndex === 0) {
            titleZone.classList.remove('hidden')
          } else {
            titleZone.classList.add('hidden')
          }
        }
      }
      updatePicker()
    }

    window.addEventListener('wheel', handleWheel)
    window.addEventListener('resize', handleResize)

    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        if (i !== currentIndex) {
          currentIndex = i
          updateDetails(currentIndex)

          if (window.innerWidth <= 1024) {
            // Mobile: Instant update
            updatePicker()
          } else {
            // Desktop: Smooth GSAP animation
            if (pickerList) {
              gsap.to(pickerList, {
                y: -currentIndex * 90,
                duration: 0.4,
                ease: 'power3.out',
                onUpdate: updatePicker,
              })
            } else {
              updatePicker()
            }
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

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', handleResize)
    }
  }, [pricelist, loading, error])

  if (loading) return <div>Loading pricing information...</div>
  if (error) return <div>Error loading pricing: {error}</div>

  return <div ref={containerRef} className="pricelist-container" />
}
