import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Link } from '@/domain/links/enterprise/entities/link'
import { LinksRepository } from '../../application/repositories/links-repository'
import { Either, right } from '@/core/types/either'
import { Injectable } from '@nestjs/common'

interface LinksRequest {
  originalUrl: string
  userId?: string
}

export type CreateLinksResponse = Either<null, { link: Link }>

@Injectable()
export class CreateLinksUseCase {
  constructor(private linkRepository: LinksRepository) {}

  async execute({ originalUrl, userId }: LinksRequest) {
    const links = Link.create({
      originalUrl,
      userId: userId ? new UniqueEntityId(userId) : undefined,
    })

    await this.linkRepository.create(links)

    return right({ link: links })
  }
}
