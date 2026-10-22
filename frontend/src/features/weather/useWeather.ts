import { useCallback, useEffect, useState } from 'react'

type Weather = { temperature: number; description: string }

const weatherLabels: Record<number, string> = {
  0: 'Clear skies', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy',
  45: 'Foggy', 48: 'Foggy', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Light rain', 63: 'Rainy', 65: 'Heavy rain', 71: 'Light snow',
  73: 'Snowy', 75: 'Heavy snow', 80: 'Rain showers', 81: 'Rain showers',
  82: 'Heavy showers', 95: 'Thunderstorms',
}

export function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refresh = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError(false)
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=24.8607&longitude=67.0011&current=temperature_2m,weather_code&timezone=Asia%2FKarachi'
      const response = await fetch(url, { signal })
      if (!response.ok) throw new Error('Weather service unavailable')
      const body = await response.json() as { current?: { temperature_2m?: number; weather_code?: number } }
      const current = body.current
      if (typeof current?.temperature_2m !== 'number' || typeof current.weather_code !== 'number') {
        throw new Error('Weather data unavailable')
      }
      setWeather({ temperature: Math.round(current.temperature_2m), description: weatherLabels[current.weather_code] ?? 'Current conditions' })
    } catch (cause) {
      if ((cause as Error).name !== 'AbortError') setError(true)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void refresh(controller.signal)
    return () => controller.abort()
  }, [refresh])

  return { weather, loading, error, refresh: () => refresh() }
}

