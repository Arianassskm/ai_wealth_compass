import { config } from '@/config'

interface FetchOptions extends RequestInit {
  token?: string | null
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  })

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    ...fetchOptions,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || '请求失败')
  }

  return data
} 