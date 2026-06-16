'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseMockDataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useMockData<T>(fetcher: () => T, delay = 800): UseMockDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchKey, setFetchKey] = useState(0)

  const loadData = useCallback(() => {
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      try {
        const result = fetcher()
        setData(result)
        setLoading(false)
      } catch (e) {
        setError(e instanceof Error ? e.message : '数据加载失败')
        setLoading(false)
      }
    }, delay)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, fetchKey])

  useEffect(() => {
    const cleanup = loadData()
    return cleanup
  }, [loadData])

  const refetch = useCallback(() => {
    setFetchKey(k => k + 1)
  }, [])

  return { data, loading, error, refetch }
}
