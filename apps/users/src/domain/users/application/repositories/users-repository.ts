import { User } from '@/domain/users/enterprise/entities/user'

export abstract class UsersRepository {
  abstract create(user: User): Promise<User>
  abstract save(user: User): Promise<User>
  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract delete(user: User): Promise<void>
}
