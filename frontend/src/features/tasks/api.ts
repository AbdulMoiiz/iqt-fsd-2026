export type Task = {
  id: number
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

type ApiError = { error?: { message?: string } }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/tasks${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null) as ApiError | null
    throw new Error(body?.error?.message || `Request failed (${response.status})`)
  }

  if (response.status === 204) return undefined as T
  const body = await response.json() as { data: T }
  return body.data
}

export const taskApi = {
  list: () => request<Task[]>(''),
  create: (title: string) => request<Task>('', {
    method: 'POST', body: JSON.stringify({ data: { title } }),
  }),
  update: (id: number, changes: { title?: string; completed?: boolean }) => request<Task>(`/${id}`, {
    method: 'PATCH', body: JSON.stringify({ data: changes }),
  }),
  delete: (id: number) => request<void>(`/${id}`, { method: 'DELETE' }),
}

