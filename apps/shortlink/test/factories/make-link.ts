import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '../../src/core/entities/unique-entity-id'
import { Link, LinkProps } from '@/domain/shortlink/enterprise/entities/link'
export function makeLink(
  override: Partial<LinkProps> = {},
  id?: UniqueEntityId,
) {
  const link = Link.create(
    {
      ...override,
      originalUrl: faker.internet.url(),
    },
    id,
  )

  return link
}
