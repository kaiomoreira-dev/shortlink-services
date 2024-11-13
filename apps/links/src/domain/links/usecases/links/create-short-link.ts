import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Link } from '@/domain/links/enterprise/entities/link'
import { LinksRepository } from '../../application/repositories/links-repository'
import { Either, right } from '@/core/types/either'
import { Injectable } from '@nestjs/common'
import { EnvService } from '@/infra/env/env.service'

interface LinksRequest {
  originalUrl: string
  userId?: string
}

export type CreateLinksResponse = Either<null, { link: Link }>

@Injectable()
export class CreateLinksUseCase {
  constructor(
    private linkRepository: LinksRepository,
    private envService: EnvService,
  ) {}

  async execute({ originalUrl, userId }: LinksRequest) {
    const NODE_ENV = this.envService.get('NODE_ENV')
    const API_DEVELOPMENT_URL = this.envService.get('API_DEVELOPMENT_URL')
    const API_PRODUCTION_URL = this.envService.get('API_PRODUCTION_URL')

    const baseUrl =
      NODE_ENV === 'development' ? API_DEVELOPMENT_URL : API_PRODUCTION_URL
    const links = Link.create(
      {
        originalUrl,
        userId: userId ? new UniqueEntityId(userId) : undefined,
      },
      baseUrl,
    )

    await this.linkRepository.create(links)

    return right({ link: links })
  }
}
