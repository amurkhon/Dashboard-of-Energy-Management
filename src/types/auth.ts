export interface LoginRequest {
  email: string
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
  full_name: string
  role: 'admin' | 'operator' | 'viewer'
  is_active: boolean
  created_at: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
}
