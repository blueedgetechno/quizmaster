import { useState } from 'react'

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useAsync<T>() {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const callFn = (fn: () => Promise<T>) => {
    setIsLoading(true)
    setError(null)

    fn()
      .then((data) => setData(data))
      .catch((error) => {
        setError(
          error.response?.data?.error?.statusText ||
            error.response?.statusText ||
            error.message ||
            error.data?.message ||
            error
        )
      })
      .finally(() => setIsLoading(false))
  }

  return { data, error, isLoading, callFn }
}

export const plural = (n: number, s: string) => (n === 1 ? s : s + 's')
export const doubleDigit = (n: number) => (n < 10 ? '0' + n : n)

const appendPlural = (n: number, s: string) => n + ' ' + plural(n, s)

export function shortit(t: number) {
  if (t < 1) return `now`
  else if (t < 60) return `${t} min`
  else if (t < 1440) return appendPlural(Math.floor(t / 60), 'hour')
  else if (t < 43200) return appendPlural(Math.floor(t / 1440), 'day')
  else if (t < 525600) return appendPlural(Math.floor(t / 43200), 'month')
  else return appendPlural(Math.floor(t / 525600), 'year')
}

export function minifyDate(d: string) {
  const d1 = new Date().getTime()
  const d2 = new Date(d).getTime()

  const t = Math.round((d1 - d2) / (60 * 1000))

  return shortit(t) + (t < 1 ? '' : ' ago')
}

export function timedate(d: string) {
  const t = new Date(d)

  if (window.innerWidth < 768)
    return t.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    })

  return (
    t.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    }) +
    ', ' +
    t.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    })
  )
}
