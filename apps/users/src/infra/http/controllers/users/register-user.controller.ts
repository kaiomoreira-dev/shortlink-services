import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { HttpUsersPresenter } from '../../presenters/http-users-presenter'
import { RegisterUserUsecase } from '@/domain/users/usecases/users/register-user-usecase'
import { UserAlreadyExistsError } from '@/domain/users/usecases/errors/user-already-exists-error'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RegisterUserDto } from '@/infra/dtos/register-user.dto'

const registerUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

type RegisterUserBody = z.infer<typeof registerUserBodySchema>
@ApiTags('Users')
@Controller('/users')
export class RegisterUserController {
  constructor(private registerUserUsecase: RegisterUserUsecase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerUserBodySchema))
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Usuário já existe.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() body: RegisterUserBody) {
    const { name, email, password } = body

    const result = await this.registerUserUsecase.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }

    if (result.isRight()) {
      return HttpUsersPresenter.toHttp(result.value.user)
    }
  }
}
