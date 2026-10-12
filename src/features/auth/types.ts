export interface User{
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
    managerId:string | null,
    isSystemAdmin: boolean
    isActive: boolean
}

export interface AuthResult {
    token: string,
    expiresAtUtc: string,
    user: User,
}