import { UsersRepository } from '@/domain/user/application/repositories/users-repository'
import { User } from '@/domain/user/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(user: User): Promise<User> {
    this.items.push(user)

    return user
  }

  async save({ name, email, password }: User): Promise<User> {
    const findUserIndex = this.items.findIndex((item) => item.email === email)

    this.items[findUserIndex].name = name
    this.items[findUserIndex].email = email
    this.items[findUserIndex].password = password

    return this.items[findUserIndex]
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async delete(user: User): Promise<void> {
    const findIndexUser = this.items.findIndex((item) => item.id === user.id)

    this.items[findIndexUser].setDeletedAt()
  }
}
