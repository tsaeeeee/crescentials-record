import { useState, useEffect } from 'react'

export interface PricelistItem {
  id: string
  name: string
  description: string
  features: string[]
  price: {
    amount: number
    currency: string
    display: string
  }
  popular: boolean
}

export function usePricelist() {
  const [pricelist, setPricelist] = useState<PricelistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPricelist() {
      try {
        const response = await fetch('/data/pricelist.json')
        if (!response.ok) {
          throw new Error('Failed to fetch pricelist data')
        }
        const data = await response.json()
        setPricelist(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPricelist()
  }, [])

  return { pricelist, loading, error }
}