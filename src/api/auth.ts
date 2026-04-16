 import axios from 'axios'
import { API_BASE_URL } from '@/config/constants'
import type { LoginRequest, TokenResponse, UserOut, RegisterRequest } from '@/types/auth'

// Use plain axios (not the intercepted instance) for auth calls to avoid loops
const authAxios = axios.create({ baseURL: API_BASE_URL, timeout: 10_000 })

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const res = await authAxios.post<TokenResponse>('/auth/login', {
    identifier: data.identifier,
    password: data.password,
  })
  return res.data
}

export async function register(data: RegisterRequest): Promise<UserOut> {
  const res = await authAxios.post<UserOut>('/auth/register', data)
  return res.data
}

export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  const res = await authAxios.post<TokenResponse>('/auth/refresh', {
    refresh_token: refreshToken,
  })
  return res.data
}
