import { InMemoryLinksRepository } from 'test/repositories/in-memory-links-repository'
import { RedirectToLinkUseCase } from './redirect-to-link'
import { MockEnvService } from 'test/env/faker-env'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CreateLinksUseCase } from './create-short-link'

let inMemoryLinksRepository: InMemoryLinksRepository
let inMemoryEnvService: MockEnvService
let stu: RedirectToLinkUseCase
let createLinksUseCase: CreateLinksUseCase

describe('Redirect To Link', () => {
  beforeEach(() => {
    inMemoryLinksRepository = new InMemoryLinksRepository()
    inMemoryEnvService = new MockEnvService()
    createLinksUseCase = new CreateLinksUseCase(
      inMemoryLinksRepository,
      inMemoryEnvService,
    )
    stu = new RedirectToLinkUseCase(inMemoryLinksRepository, inMemoryEnvService)
  })

  it('should be redirect to link by short code', async () => {
    const result = await createLinksUseCase.execute({
      originalUrl: 'https://teddy360.com.br/',
      userId: 'c71ec6ec-b22b-44ec-8f22-3ad3f7e3c43d',
    })

    if (result.isRight()) {
      const resultRedirect = await stu.execute({
        shortCode: result.value.link.shortUrl,
      })

      expect(resultRedirect.isRight()).toBeTruthy()
      if (resultRedirect.isRight()) {
        expect(resultRedirect.value.link.originalUrl).toEqual(
          'https://teddy360.com.br/',
        )
        expect(resultRedirect.value.link.clicks).not.toEqual(0)
      }
    }
  })

  it('should be count clicks when redirect to link', async () => {
    const result = await createLinksUseCase.execute({
      originalUrl: 'https://teddy360.com.br/',
    })

    if (result.isRight()) {
      const resultFindLink = await stu.execute({
        shortCode: result.value.link.shortUrl,
      })

      expect(resultFindLink.isRight()).toBeTruthy()
      if (resultFindLink.isRight()) {
        expect(resultFindLink.value.link.clicks).not.toEqual(0)
      }
    }
  })

  it('should not be redirect to link with invalid short code', async () => {
    const result = await stu.execute({
      shortCode: 'invalid-short-code',
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
