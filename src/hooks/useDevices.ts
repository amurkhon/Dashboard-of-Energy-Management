import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDevices, createDevice, updateDevice, deleteDevice,
  getDeviceGroups, createDeviceGroup, deleteDeviceGroup,
} from '@/api/devices'
import { QK } from '@/api/queryKeys'
import type { DeviceCreate, DeviceGroupCreate } from '@/types/device'

export function useDevices() {
  return useQuery({ queryKey: QK.devices, queryFn: getDevices })
}

export function useDeviceGroups() {
  return useQuery({ queryKey: QK.deviceGroups, queryFn: getDeviceGroups })
}

export function useCreateDevice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DeviceCreate) => createDevice(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.devices }),
  })
}

export function useUpdateDevice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeviceCreate> }) => updateDevice(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.devices }),
  })
}

export function useDeleteDevice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDevice(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.devices }),
  })
}

export function useCreateDeviceGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DeviceGroupCreate) => createDeviceGroup(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.deviceGroups }),
  })
}

export function useDeleteDeviceGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDeviceGroup(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.deviceGroups }),
  })
}
