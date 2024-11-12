import { Either, left, right } from '@/core/types/either'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'
import { User } from '@/domain/users/enterprise/entities/user'
import { HashGenerator } from '@/domain/users/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { UserAlreadyExistsError } from '@/domain/users/usecases/errors/user-already-exists-error'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
}

export type RegisterUserResponse = Either<
  UserAlreadyExistsError,
  { user: User }
>

@Injectable()
export class RegisterUserUsecase {
  constructor(
    private userRepository: UsersRepository,
    private hashGerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserResponse> {
    // buscar usuario pelo email
    const findUser = await this.userRepository.findByEmail(email)

    // validar se exister user pelo email
    if (findUser) {
      return left(new UserAlreadyExistsError(findUser.email))
    }

    // criar hash para senha
    const hashedPassword = await this.hashGerator.generate(password)

    // criar usuário na camada de dominio
    const createdUser = User.create({
      email,
      name,
      password: hashedPassword,
    })

    // salvar usuário no repositório
    await this.userRepository.create(createdUser)

    // retornar usuário
    return right({ user: createdUser })
  }
}
