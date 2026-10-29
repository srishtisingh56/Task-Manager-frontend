import type { User } from '@/features/auth/types'

export function canEditUser(me: User, user: User): boolean {
    return me.id === user.id || me.isSystemAdmin
}
