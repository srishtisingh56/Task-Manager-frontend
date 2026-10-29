import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '@/lib/apiError'
import { toast } from '@/lib/toastStore'
import {
  assignManager, createUser, deactivateUser, demoteFromSystemAdmin, promoteToSystemAdmin,
  reactivateUser, removeManager, updateContactDetails, type UpdateContactDetailsBody,
} from '../usersApi'
import { userKeys } from './useUsers'

function useRefreshUsers() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: userKeys.all })
    queryClient.invalidateQueries({ queryKey: ['users', 'my-workers'] }) // hierarchy change can affect the caller's worker list too
  }
}

export function useAssignManager() {
  const refresh = useRefreshUsers()
  return useMutation({
    mutationFn: ({ workerId, managerId }: { workerId: string; managerId: string }) =>
      assignManager(workerId, managerId),
    onSuccess: () => toast.success('Manager assigned'),
    // onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

export function useRemoveManager() {
  const refresh = useRefreshUsers()
  return useMutation({
    mutationFn: (workerId: string) => removeManager(workerId),
    onSuccess: () => toast.success('Manager removed'),
    onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

export function usePromoteToSystemAdmin() {
  const refresh = useRefreshUsers()
  return useMutation({
    mutationFn: (userId: string) => promoteToSystemAdmin(userId),
    onSuccess: () => toast.success('User promoted to system admin'),
    onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

export function useDemoteFromSystemAdmin() {
  const refresh = useRefreshUsers()
  return useMutation({
    mutationFn: (userId: string) => demoteFromSystemAdmin(userId),
    onSuccess: () => toast.success('User demoted from system admin'),
    onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

export function useDeactivateUser() {
  const refresh = useRefreshUsers()
  return useMutation({
    mutationFn: (userId: string) => deactivateUser(userId),
    onSuccess: () => toast.success('User deactivated'),
    onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

export function useReactivateUser() {
  const refresh = useRefreshUsers()
  return useMutation({
    mutationFn: (userId: string) => reactivateUser(userId),
    onSuccess: () => toast.success('User reactivated'),
    onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

export function useUpdateContactDetails() {
  const refresh = useRefreshUsers()
  return useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: UpdateContactDetailsBody }) =>
      updateContactDetails(userId, body),
    onSuccess: () => toast.success('Contact details updated'),
    onError: (e) => toast.error(getErrorMessage(e)),
    onSettled: refresh,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  })
}
