'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseApiDataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useApiData<T>(url: string, enabled = true): UseApiDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          throw new Error(json.error || `请求失败 (${res.status})`)
        }
        return res.json()
      })
      .then((json) => {
        if (!cancelled) {
          setData(json.data ?? json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [url, fetchKey, enabled])

  const refetch = useCallback(() => {
    setFetchKey(k => k + 1)
  }, [])

  return { data, loading, error, refetch }
}

export function useApiMutation<T = unknown>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (url: string, options?: RequestInit): Promise<T> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || `请求失败 (${res.status})`)
      }
      setLoading(false)
      return json.data ?? json
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }, [])

  return { mutate, loading, error }
}
