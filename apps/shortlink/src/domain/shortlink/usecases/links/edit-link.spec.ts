import { InMemoryLinksRepository } from 'test/repositories/in-memory-links-repository'
import { EditShortLinkUseCase } from './edit-link'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeLink } from 'test/factories/make-link'
import { CreateShortLinkUseCase } from './create-short-link'

let inMemoryLinksRepository: InMemoryLinksRepository
let stu: EditShortLinkUseCase
let createShortLinkUseCase: CreateShortLinkUseCase

describe('Edit Short Link', () => {
  beforeEach(() => {
    inMemoryLinksRepository = new InMemoryLinksRepository()
    createShortLinkUseCase = new CreateShortLinkUseCase(inMemoryLinksRepository)
    stu = new EditShortLinkUseCase(inMemoryLinksRepository)
  })

  it('should be able to edit a short link', async () => {
    // cria na camada de domínio
    const link = makeLink()

    // cria na camada de infra
    await inMemoryLinksRepository.create(link)

    const result = await createShortLinkUseCase.execute({
      originalUrl: 'https://teddy360.com.br/',
      userId: link.id,
    })

    if (result.isRight()) {
      const resultUpdated = await stu.execute({
        linkId: result.value.link.id,
        newOriginalUrl: 'https://teddy360.com.br/updated',
      })

      expect(resultUpdated.isRight()).toBeTruthy()
      if (resultUpdated.isRight()) {
        expect(resultUpdated.isRight()).toBeTruthy()
        expect(resultUpdated.value.link.originalUrl).toEqual(
          'https://teddy360.com.br/updated',
        )
        expect(resultUpdated.value.link.updatedAt).not.toBeNull()
      }
    }
  })

  it('should not be able to edit a short link with invalid id', async () => {
    const result = await stu.execute({
      linkId: 'invalid-id',
      newOriginalUrl: 'https://teddy360.com.br/updated',
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should not be to edit a short link deleted', async () => {
    const result = await stu.execute({
      linkId: 'invalid-id',
      newOriginalUrl: 'https://teddy360.com.br/updated',
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
