import { Either, right } from '@/core/types/either'
import { LinksRepository } from '@/domain/shortlink/application/repositories/links-repository'
import { Link } from '@/domain/shortlink/enterprise/entities/link'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface FetchLinkRequest {
  page: number
  userId: string
}

export type FetchLinksResponse = Either<
  ResourceNotFoundError,
  { links: Link[] }
>

@Injectable()
export class FetchLinkUseCase {
  constructor(private linkRepository: LinksRepository) {}

  async execute({
    page,
    userId,
  }: FetchLinkRequest): Promise<FetchLinksResponse> {
    const findManyLinks = await this.linkRepository.findManyByUserId(userId, {
      page,
    })

    return right({ links: findManyLinks })
  }
}
