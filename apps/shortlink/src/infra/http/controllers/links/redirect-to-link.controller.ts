import {
  BadRequestException,
  NotFoundException,
  Controller,
  Get,
  Param,
  Redirect,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { RedirectToLinkUseCase } from '@/domain/shortlink/usecases/links/redirect-to-link'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Public } from '@/infra/auth/public'

// Esquema de validação para o `shortCode`
const shortCodeParamSchema = z.string().min(1)

const paramRedirectValidationPipe = new ZodValidationPipe(shortCodeParamSchema)

type ShortCodeParam = z.infer<typeof shortCodeParamSchema>

@Controller('/:shortCode')
@Public()
export class RedirectToLinkController {
  constructor(private redirectToLinkUseCase: RedirectToLinkUseCase) {}

  @Get()
  @Redirect()
  async handle(
    @Param('shortCode', paramRedirectValidationPipe) shortCode: ShortCodeParam, // Corrigido para 'shortCode'
  ) {
    const result = await this.redirectToLinkUseCase.execute({ shortCode })

    // tratativa de erro para quando nao encontrar o link
    // e para caso for um erro 500
    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }

    if (result.isRight()) {
      const originalUrl = result.value.link.originalUrl

      return { url: originalUrl, statusCode: 302 }
    }
  }
}
