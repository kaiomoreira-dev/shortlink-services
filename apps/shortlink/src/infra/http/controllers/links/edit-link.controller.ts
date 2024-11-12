import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { HttpLinksPresenter } from '@/infra/http/presenters/http-links-presenter'
import { EditShortLinkUseCase } from '@/domain/shortlink/usecases/links/edit-link'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const editLinkSchema = z.object({
  newOriginalUrl: z.string().url().min(1),
})

const bodyValidationPipe = new ZodValidationPipe(editLinkSchema)

type EditLinkSchema = z.infer<typeof editLinkSchema>

@Controller('/links/:id')
export class EditShortLinkController {
  constructor(private editLinkUseCase: EditShortLinkUseCase) {}

  @Patch()
  async handle(
    @Param('id') linkId: string,
    @Body(bodyValidationPipe) body: EditLinkSchema,
  ) {
    const { newOriginalUrl } = body

    const result = await this.editLinkUseCase.execute({
      newOriginalUrl,
      linkId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }

    if (result.isRight()) {
      const editdLink = result.value.link

      return HttpLinksPresenter.toHttp(editdLink)
    }
  }
}
