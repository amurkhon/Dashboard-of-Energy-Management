export interface LoginRequest {
  identifier: string  // email or username
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface UserOut {
  id: string
  email: string
  username: string | null
  full_name: string | null
  role: 'admin' | 'operator' | 'viewer'
  is_active: boolean
  created_at: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
  username?: string
}
