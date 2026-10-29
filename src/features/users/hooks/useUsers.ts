import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchAllUsers, fetchUserById, type UserFilters } from '../usersApi'

export const userKeys = {
  all: ['users'] as const,
  list: (filters: UserFilters) => ['users', 'list', filters] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
}

export function useAllUsers(filters: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchAllUsers(filters),
    placeholderData: keepPreviousData,
  })
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ''),
    queryFn: () => fetchUserById(id ?? ''),
    enabled: !!id,
  })
}
