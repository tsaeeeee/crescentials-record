import { useEffect, useState } from 'react'

interface ContactData {
  email: string
  phone: string
  address: string
  social: {
    instagram: string
    youtube: string
    spotify: string
  }
}

export function useContact() {
  const [contact, setContact] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContact() {
      try {
        const response = await fetch('/data/contact.json')
        if (!response.ok) {
          throw new Error('Failed to fetch contact data')
        }
        const data = await response.json()
        setContact(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchContact()
  }, [])

  return { contact, loading, error }
}
