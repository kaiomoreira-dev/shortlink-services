import { InMemoryLinksRepository } from 'test/repositories/in-memory-links-repository'
import { CreateLinksUseCase } from './create-short-link'
import { MockEnvService } from 'test/env/faker-env'

let inMemoryLinksRepository: InMemoryLinksRepository
let inMemoryEnvService: MockEnvService
let stu: CreateLinksUseCase

describe('Create Short Link', () => {
  beforeEach(() => {
    inMemoryLinksRepository = new InMemoryLinksRepository()
    inMemoryEnvService = new MockEnvService()
    stu = new CreateLinksUseCase(inMemoryLinksRepository, inMemoryEnvService)
  })

  it('should be able to create a short link with user', async () => {
    const originalUrl = 'https://teddy360.com.br/'
    const userId = 'c71ec6ec-b22b-44ec-8f22-3ad3f7e3c43d'

    const result = await stu.execute({
      originalUrl,
      userId,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.link.userId?.toValue()).toEqual(userId)
      expect(result.value.link.clicks).toEqual(0)
      expect(result.value.link.originalUrl).toEqual(originalUrl)
      expect(typeof result.value.link.shortUrl).toEqual('string')
      expect(result.value.link.shortUrl).not.toBeNull()
    }
  })

  it('should be able to create a short link without user', async () => {
    const originalUrl = 'https://teddy360.com.br/'

    const createLink = await stu.execute({
      originalUrl,
    })

    if (createLink.isRight()) {
      expect(createLink.value.link.userId).toBeNull()
      expect(createLink.value.link.clicks).toEqual(0)
      expect(createLink.value.link.originalUrl).toEqual(originalUrl)
      expect(typeof createLink.value.link.shortUrl).toEqual('string')
      expect(createLink.value.link.shortUrl).not.toBeNull()
    }
  })
})
