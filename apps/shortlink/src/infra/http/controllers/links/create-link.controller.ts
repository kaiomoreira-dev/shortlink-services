import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { HttpLinksPresenter } from '@/infra/http/presenters/http-links-presenter'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { Public } from '@/infra/auth/public'
import { CreateShortLinkUseCase } from '@/domain/shortlink/usecases/links/create-short-link'

const createLinkSchema = z.object({
  originalUrl: z.string().url().min(1),
})

const bodyValidationPipe = new ZodValidationPipe(createLinkSchema)

type CreateLinkSchema = z.infer<typeof createLinkSchema>

@Controller('/links')
@Public()
export class CreateShortLinkController {
  constructor(private createLinkUseCase: CreateShortLinkUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateLinkSchema,
    @CurrentUser() user?: UserPayload,
  ) {
    const { originalUrl } = body
    const userId = user ? user.sub : null

    const result = await this.createLinkUseCase.execute({
      originalUrl,
      userId,
    })

    if (result.isRight()) {
      const createdLink = result.value.link

      return HttpLinksPresenter.toHttp(createdLink)
    }

    // tratativa de erro para caso for um erro 500
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
