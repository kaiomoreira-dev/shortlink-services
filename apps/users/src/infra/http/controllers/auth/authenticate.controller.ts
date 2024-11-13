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
import { AuthenticateUserUsecase } from '@/domain/users/usecases/auth/authenticate-user-usecase'
import { WrongCredentialsError } from '@/domain/users/usecases/errors/wrong-credentials-erros'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthenticateUserDto } from '@/infra/dtos/authenticate-use.dto'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticateBody = z.infer<typeof authenticateBodySchema>

@ApiTags('Sessions')
@Controller('/sessions')
export class AutheticateController {
  constructor(private authenticateUseCase: AuthenticateUserUsecase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @ApiOperation({
    summary: 'Authenticate user',
    description: 'Logs in a user and returns an authentication token.',
  })
  @ApiBody({ type: AuthenticateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated, returns a token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Credentials is not valid.',
  })
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
