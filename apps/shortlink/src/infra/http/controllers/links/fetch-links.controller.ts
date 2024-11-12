import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchLinkUseCase } from '@/domain/shortlink/usecases/links/fetch-link'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { HttpLinksPresenter } from '@/infra/http/presenters/http-links-presenter'
import { Public } from '@/infra/auth/public'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParam = z.infer<typeof pageQueryParamSchema>
@Controller('/links')
export class FetchLinkController {
  constructor(private fetchLinkUseCase: FetchLinkUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParam,
    @CurrentUser() user?: UserPayload,
  ) {
    const { sub: userId } = user

    const result = await this.fetchLinkUseCase.execute({
      page,
      userId,
    })

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
      return result.value.links.map(HttpLinksPresenter.toHttp)
    }
  }
}
