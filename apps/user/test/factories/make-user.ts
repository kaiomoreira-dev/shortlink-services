import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '../../src/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/user/enterprise/entities/user'
export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const user = User.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return user
}
