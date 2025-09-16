import { useId, useEffect, useState, useCallback } from 'react'

interface PricePackage {
  id: string
  name: string
  price: string
  features: string[]
}

export function PricelistSection() {
  const detailsId = useId()
  const [selectedPackage, setSelectedPackage] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Sample pricing data - in production this would come from props or API
  const packages: PricePackage[] = [
    {
      id: 'basic',
      name: 'Basic Recording',
      price: 'Rp 500.000',
      features: [
        'Recording session up to 4 hours',
        'Basic mixing and mastering',
        'Up to 3 revisions',
        'Digital delivery (MP3/WAV)',
        'Single track production'
      ]
    },
    {
      id: 'professional',
      name: 'Professional Package',
      price: 'Rp 1.500.000',
      features: [
        'Recording session up to 8 hours',
        'Professional mixing and mastering',
        'Unlimited revisions',
        'High-quality digital delivery',
        'Album artwork design',
        'Social media assets'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Studio',
      price: 'Rp 3.000.000',
      features: [
        'Full day recording session',
        'Premium mixing and mastering',
        'Live recording capabilities',
        'Video recording session',
        'Complete album production',
        'Marketing consultation',
        'Distribution assistance'
      ]
    },
    {
      id: 'custom',
      name: 'Custom Production',
      price: 'Contact Us',
      features: [
        'Tailored to your needs',
        'Extended recording time',
        'Multi-track production',
        'Live band recording',
        'Music video production',
        'Full creative direction'
      ]
    }
  ]

  const nextPackage = useCallback(() => {
    setSelectedPackage((prev) => (prev + 1) % packages.length)
  }, [packages.length])

  const prevPackage = useCallback(() => {
    setSelectedPackage((prev) => (prev - 1 + packages.length) % packages.length)
  }, [packages.length])

  const handlePackageSelect = useCallback((index: number) => {
    setSelectedPackage(index)
    setIsVisible(false)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handlePackageSelect(index)
    }
  }, [handlePackageSelect])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        prevPackage()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        nextPackage()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [nextPackage, prevPackage])

  useEffect(() => {
    // Show details when package is selected
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [selectedPackage])

  const currentPackage = packages[selectedPackage]

  return (
    <>
      <div className="pricelist-container">
        {/* Left Panel - Package Picker */}
        <div className="left">
          <div className="title-zone">
            <div className="title">Choose Your Package</div>
          </div>
          
          <div className="picker-zone">
            <div className="picker">
              {packages.map((pkg, index) => (
                <button
                  key={pkg.id}
                  type="button"
                  className="picker-item"
                  style={{
                    opacity: index === selectedPackage ? 1 : 0.3,
                    transform: `translateY(${(index - selectedPackage) * 100}px)`
                  }}
                  onClick={() => handlePackageSelect(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  {pkg.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Package Details */}
        <div className="right">
          <div id={detailsId} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="price">{currentPackage.price}</div>
            <ul>
              {currentPackage.features.map((feature) => (
                <li key={feature}>
                  <span>✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="notes">
            <p>
              All packages include consultation and project planning. 
              Contact us for custom requirements or bulk discounts.
            </p>
            <p>
              <strong>Note:</strong> Prices may vary based on project complexity 
              and additional requirements.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}