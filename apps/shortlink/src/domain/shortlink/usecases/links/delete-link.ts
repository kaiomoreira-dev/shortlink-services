import { Either, left, right } from '@/core/types/either'
import { LinksRepository } from '@/domain/shortlink/application/repositories/links-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface ShortLinkRequest {
  linkId: string
}

type DeleteShortLinkResponse = Either<ResourceNotFoundError, boolean>

@Injectable()
export class DeleteShortLinkUseCase {
  constructor(private linkRepository: LinksRepository) {}

  async execute({
    linkId,
  }: ShortLinkRequest): Promise<DeleteShortLinkResponse> {
    // buscar link pelo id
    const link = await this.linkRepository.findById(linkId)

    // validar se o link existe
    if (!link) {
      return left(new ResourceNotFoundError())
    }

    // aplicar soft delete
    link.setDeletedAt()

    // salvar link deletado
    await this.linkRepository.save(link)

    return right(true)
  }
}
