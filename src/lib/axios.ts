import axios from 'axios'
import { API_BASE_URL } from '@/config/constants'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
})

// ── Request interceptor: attach access token ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor: silent refresh on 401 ───────────────────────────────
let _refreshPromise: Promise<string> | null = null

api.interceptors.response.use(
  (res) => res,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error)

    const original = error.config as typeof error.config & { _retried?: boolean }
    if (error.response?.status !== 401 || original?._retried) {
      return Promise.reject(error)
    }
    if (original) original._retried = true

    const { refreshToken, logout } = useAuthStore.getState()

    if (!refreshToken) {
      logout()
      return Promise.reject(error)
    }

    try {
      if (!_refreshPromise) {
        _refreshPromise = axios
          .post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken })
          .then((r) => {
            useAuthStore.getState().setTokens(r.data.access_token as string, r.data.refresh_token as string)
            return r.data.access_token as string
          })
          .finally(() => {
            _refreshPromise = null
          })
      }

      const newToken = await _refreshPromise
      if (original?.headers) original.headers.Authorization = `Bearer ${newToken}`
      return api(original!)
    } catch {
      useAuthStore.getState().logout()
      return Promise.reject(error)
    }
  }
)

export default api
