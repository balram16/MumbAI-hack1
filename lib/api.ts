// Centralized API client
// Uses NEXT_PUBLIC_API_URL if set, falls back to existing api-config.js logic
import { API_URL as FALLBACK_API_URL } from './api-config'

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || FALLBACK_API_URL || 'http://localhost:3001'

interface ApiOptions extends RequestInit {
  auth?: boolean
  token?: string | null
  json?: any
}

function buildHeaders(options: ApiOptions = {}): HeadersInit {
  const base: Record<string, string> = {
    Accept: 'application/json'
  }
  if (options.json !== undefined) {
    base['Content-Type'] = 'application/json'
  }
  if (options.auth) {
    const token = options.token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null)
    if (token) {
      base['Authorization'] = `Bearer ${token}`
    }
  }
  return { ...base, ...(options.headers || {}) }
}

export async function api(path: string, options: ApiOptions = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  const fetchOptions: RequestInit = {
    ...options,
    headers: buildHeaders(options)
  }
  if (options.json !== undefined) {
    fetchOptions.body = JSON.stringify(options.json)
    fetchOptions.method = options.method || 'POST'
  }
  const res = await fetch(url, fetchOptions)
  let data: any = null
  try { data = await res.json() } catch { /* ignore non-JSON */ }
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

export async function get(path: string, options: ApiOptions = {}) {
  return api(path, { ...options, method: 'GET' })
}

export async function post(path: string, json?: any, options: ApiOptions = {}) {
  return api(path, { ...options, method: 'POST', json })
}

export async function statusCheck() {
  try {
    return await get('/api/auth/status')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
