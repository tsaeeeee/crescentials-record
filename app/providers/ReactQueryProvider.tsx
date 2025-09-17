import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 5 minutes
            staleTime: 1000 * 60 * 5,
            // Keep data in cache for 10 minutes
            gcTime: 1000 * 60 * 10,
            // Retry failed requests 2 times
            retry: 2,
            // Retry delay increases exponentially
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Don't refetch on window focus in development
            refetchOnWindowFocus: import.meta.env.PROD,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
