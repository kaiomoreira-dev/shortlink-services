import { InMemoryLinksRepository } from 'test/repositories/in-memory-links-repository'
import { DeleteShortLinkUseCase } from './delete-link'
import { faker } from '@faker-js/faker'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { CreateShortLinkUseCase } from './create-short-link'

let inMemoryLinksRepository: InMemoryLinksRepository
let stu: DeleteShortLinkUseCase
let createShortLinkUseCase: CreateShortLinkUseCase

describe('Delete Short Link', () => {
  beforeEach(() => {
    inMemoryLinksRepository = new InMemoryLinksRepository()
    createShortLinkUseCase = new CreateShortLinkUseCase(inMemoryLinksRepository)
    stu = new DeleteShortLinkUseCase(inMemoryLinksRepository)
  })

  it('should be able to delete using soft delete', async () => {
    const result = await createShortLinkUseCase.execute({
      originalUrl: 'https://teddy360.com.br/',
      userId: faker.string.uuid(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      await inMemoryLinksRepository.create(result.value.link)

      await stu.execute({
        linkId: result.value.link.id,
      })

      const findLink = await inMemoryLinksRepository.findById(
        result.value.link.id,
      )

      expect(findLink?.deletedAt).not.toBeNull()
    }
  })

  it('should not be able to delete using soft delete with invalid id', async () => {
    const result = await createShortLinkUseCase.execute({
      originalUrl: 'https://teddy360.com.br/',
      userId: faker.string.uuid(),
    })

    if (result.isRight()) {
      await inMemoryLinksRepository.create(result.value.link)
    }

    const resultFailed = await stu.execute({
      linkId: faker.string.uuid(),
    })

    expect(resultFailed.isLeft()).toBeTruthy()
    expect(resultFailed.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
