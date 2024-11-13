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
import { EditLinksUseCase } from '@/domain/links/usecases/links/edit-link'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { EditLinkDto } from '@/infra/dtos/edit-link.dto'

const editLinkSchema = z.object({
  newOriginalUrl: z.string().url().min(1),
})

const bodyValidationPipe = new ZodValidationPipe(editLinkSchema)

type EditLinkSchema = z.infer<typeof editLinkSchema>

@ApiTags('EditLink')
@Controller('/links/:id')
export class EditLinksController {
  constructor(private editLinkUseCase: EditLinksUseCase) {}

  @Patch()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit an existing link',
    description: 'Updates the original URL of a link identified by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the link to update',
    type: String,
  })
  @ApiBody({ type: EditLinkDto })
  @ApiResponse({
    status: 200,
    description: 'Link successfully updated.',
    schema: {
      example: {
        id: 'linkId',
        newOriginalUrl: 'https://newexample.com',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Link not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
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
