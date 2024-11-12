import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { AuthenticateUserUsecase } from '@/domain/user/usecases/auth/authenticate-user-usecase'
import { WrongCredentialsError } from '@/domain/user/usecases/errors/wrong-credentials-erros'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticateBody = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AutheticateController {
  constructor(private authenticateUseCase: AuthenticateUserUsecase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async create(@Body() body: AuthenticateBody) {
    const { email, password } = body

    const result = await this.authenticateUseCase.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }

    if (result.isRight()) {
      const { accessToken } = result.value

      return { accessToken }
    }
  }
}
