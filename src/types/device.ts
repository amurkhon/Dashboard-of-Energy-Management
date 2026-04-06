export type DeviceType =
  | 'smart_meter'
  | 'solar_panel'
  | 'wind_turbine'
  | 'battery'
  | 'hvac'
  | 'lighting'
  | 'ev_charger'
  | 'appliance'

export type DeviceProfile = 'residential' | 'commercial' | 'industrial'

export interface DeviceOut {
  id: string
  user_id: string
  group_id: string | null
  name: string
  device_type: DeviceType
  profile: DeviceProfile
  is_active: boolean
  latitude: number | null
  longitude: number | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface DeviceCreate {
  name: string
  device_type: DeviceType
  profile: DeviceProfile
  group_id?: string
  latitude?: number
  longitude?: number
  metadata?: Record<string, unknown>
}

export interface DeviceGroupOut {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  devices?: DeviceOut[]
}

export interface DeviceGroupCreate {
  name: string
  description?: string
}
