import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { DeleteLinksUseCase } from '@/domain/links/usecases/links/delete-link'

@Controller('/links/:id')
export class DeleteLinksController {
  constructor(private deleteLinkUseCase: DeleteLinksUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') linkId: string) {
    const result = await this.deleteLinkUseCase.execute({
      linkId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
