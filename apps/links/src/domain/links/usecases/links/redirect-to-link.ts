import { Either, left, right } from '@/core/types/either'
import { LinksRepository } from '../../application/repositories/links-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { Link } from '../../enterprise/entities/link'
import { Injectable } from '@nestjs/common'
import { EnvService } from '@/infra/env/env.service'

interface RedirectToLinkRequest {
  shortCode: string
}

export type RedirectToLinkResponse = Either<
  ResourceNotFoundError,
  { link: Link }
>

@Injectable()
export class RedirectToLinkUseCase {
  constructor(
    private linksRepository: LinksRepository,
    private envService: EnvService,
  ) {}

  async execute({
    shortCode,
  }: RedirectToLinkRequest): Promise<RedirectToLinkResponse> {
    const NODE_ENV = this.envService.get('NODE_ENV')
    const API_DEVELOPMENT_URL = this.envService.get('API_DEVELOPMENT_URL')
    const API_PRODUCTION_URL = this.envService.get('API_PRODUCTION_URL')

    const API_URL =
      NODE_ENV === 'development' ? API_DEVELOPMENT_URL : API_PRODUCTION_URL

    const shortUrl = `${API_URL}/${shortCode}` // colocar env da url da aplicação

    // verificar se o link existe
    const link = await this.linksRepository.findByShortCode(shortUrl)

    // verificar se o link existe
    if (!link) {
      return left(new ResourceNotFoundError())
    }

    // contabilizar o acesso ao link
    link.countClick()

    // atualizar o contador de acessos no repositório
    await this.linksRepository.save(link)

    return right({ link })
  }
}
