import api from '@/lib/axios'
import type { DeviceOut, DeviceCreate, DeviceGroupOut, DeviceGroupCreate } from '@/types/device'

export async function getDevices(): Promise<DeviceOut[]> {
  const res = await api.get<DeviceOut[]>('/devices')
  return res.data
}

export async function createDevice(data: DeviceCreate): Promise<DeviceOut> {
  const res = await api.post<DeviceOut>('/devices', data)
  return res.data
}

export async function updateDevice(id: string, data: Partial<DeviceCreate>): Promise<DeviceOut> {
  const res = await api.patch<DeviceOut>(`/devices/${id}`, data)
  return res.data
}

export async function deleteDevice(id: string): Promise<void> {
  await api.delete(`/devices/${id}`)
}

export async function getDeviceGroups(): Promise<DeviceGroupOut[]> {
  const res = await api.get<DeviceGroupOut[]>('/device-groups')
  return res.data
}

export async function createDeviceGroup(data: DeviceGroupCreate): Promise<DeviceGroupOut> {
  const res = await api.post<DeviceGroupOut>('/device-groups', data)
  return res.data
}

export async function deleteDeviceGroup(id: string): Promise<void> {
  await api.delete(`/device-groups/${id}`)
}
