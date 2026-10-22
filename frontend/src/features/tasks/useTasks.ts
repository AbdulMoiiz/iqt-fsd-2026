import { useCallback, useEffect, useState } from 'react'
import { taskApi, type Task } from './api'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setTasks(await taskApi.list())
    } catch (cause) {
      setError((cause as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const create = async (title: string) => {
    setCreating(true)
    setError(null)
    try {
      const task = await taskApi.create(title)
      setTasks(current => [task, ...current])
      return true
    } catch (cause) {
      setError((cause as Error).message)
      return false
    } finally {
      setCreating(false)
    }
  }

  const update = async (id: number, changes: { title?: string; completed?: boolean }) => {
    setPendingId(id)
    setError(null)
    try {
      const task = await taskApi.update(id, changes)
      setTasks(current => current.map(item => item.id === id ? task : item))
      return true
    } catch (cause) {
      setError((cause as Error).message)
      return false
    } finally {
      setPendingId(null)
    }
  }

  const remove = async (id: number) => {
    setPendingId(id)
    setError(null)
    try {
      await taskApi.delete(id)
      setTasks(current => current.filter(task => task.id !== id))
      return true
    } catch (cause) {
      setError((cause as Error).message)
      return false
    } finally {
      setPendingId(null)
    }
  }

  return { tasks, loading, error, pendingId, creating, refresh, create, update, remove, clearError: () => setError(null) }
}

