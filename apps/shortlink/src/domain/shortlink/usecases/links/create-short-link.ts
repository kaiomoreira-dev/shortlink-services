import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Link } from '@/domain/shortlink/enterprise/entities/link'
import { LinksRepository } from '../../application/repositories/links-repository'
import { Either, right } from '@/core/types/either'
import { Injectable } from '@nestjs/common'

interface ShortLinkRequest {
  originalUrl: string
  userId?: string
}

export type CreateShortLinkResponse = Either<null, { link: Link }>

@Injectable()
export class CreateShortLinkUseCase {
  constructor(private linkRepository: LinksRepository) {}

  async execute({ originalUrl, userId }: ShortLinkRequest) {
    const shortLink = Link.create({
      originalUrl,
      userId: userId ? new UniqueEntityId(userId) : undefined,
    })

    await this.linkRepository.create(shortLink)

    return right({ link: shortLink })
  }
}
