import { User } from '@/domain/users/enterprise/entities/user'

export class FakerUsersPresenter {
  static toTest(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
    }
  }
}
