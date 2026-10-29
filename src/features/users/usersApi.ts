import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/features/auth/types";
import type { PagedResult } from "@/types/api";

export interface Worker { id: string; name: string }

export interface UserFilters {
    pageNumber: number
    pageSize: number
    isActive?: boolean // undefined -> all, true -> active only, false -> deactivated only
}

async function fetchMyWorkers():Promise<Worker[]> {
    const {data} = await api.get<Worker[]>('/users/me/workers');
    return data;
}

export function useWorkers() {
    return useQuery({   
        queryKey: ['users','my-workers'],
        queryFn: fetchMyWorkers,
        staleTime: 5*60*1000,
    })
}

// System-admin only.
export async function fetchAllUsers(filters: UserFilters): Promise<PagedResult<User>> {
    const { data } = await api.get<PagedResult<User>>('/users', { params: filters });
    return data;
}

export interface UserDetail extends User {
    managerName: string | null
}

// Self, direct manager, direct workers, or system admin only — else 403.
export async function fetchUserById(userId: string): Promise<UserDetail> {
    const { data } = await api.get<UserDetail>(`/users/${userId}`);
    return data;
}

// The 4 commands below are system-admin only.
export async function assignManager(workerId: string, managerId: string): Promise<User> {
    const { data } = await api.put<User>(`/users/${workerId}/manager`, { managerId });
    return data;
}

export async function removeManager(workerId: string): Promise<User> {
    const { data } = await api.delete<User>(`/users/${workerId}/manager`);
    return data;
}

export async function promoteToSystemAdmin(userId: string): Promise<User> {
    const { data } = await api.post<User>(`/users/${userId}/promote`);
    return data;
}

export async function demoteFromSystemAdmin(userId: string): Promise<User> {
    const { data } = await api.post<User>(`/users/${userId}/demote`);
    return data;
}

export async function deactivateUser(userId: string): Promise<User> {
    const { data } = await api.post<User>(`/users/${userId}/deactivate`);
    return data;
}

export async function reactivateUser(userId: string): Promise<User> {
    const { data } = await api.post<User>(`/users/${userId}/reactivate`);
    return data;
}

// Only present fields are sent — omitted vs. explicit means PATCH semantics, as with task details/deadlines.
export interface UpdateContactDetailsBody {
    name?: string
    email?: string
    phoneNumber?: string
}

// Self or system admin only.
export async function updateContactDetails(userId: string, body: UpdateContactDetailsBody): Promise<User> {
    const { data } = await api.patch<User>(`/users/${userId}/contact`, body);
    return data;
}

export interface CreateUserBody {
    name: string
    email: string
    phoneNumber: string
    password: string
}

// System-admin only.
export async function createUser(body: CreateUserBody): Promise<User> {
    const { data } = await api.post<User>('/users', body);
    return data;
}