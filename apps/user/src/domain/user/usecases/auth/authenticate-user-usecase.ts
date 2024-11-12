import { Either, left, right } from '@/core/types/either'
import { UsersRepository } from '../../application/repositories/users-repository'
import { WrongCredentialsError } from '../errors/wrong-credentials-erros'
import { HashComparer } from '../../application/cryptography/hash-comparer'
import { Encrypter } from '../../application/cryptography/encrypter'
import { Injectable } from '@nestjs/common'

interface AuthenticateUserUseCaseRequest {
  password: string
  email: string
}

export type AuthenticateUserResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateUserUsecase {
  constructor(
    private userRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserResponse> {
    // buscar usuario pelo email
    const user = await this.userRepository.findByEmail(email)

    // validar se exister user pelo email
    if (!user) {
      return left(new WrongCredentialsError())
    }

    // comparar a senha do usuário com a do repositório
    const isPasswordRight = await this.hashComparer.compare(
      password,
      user.password,
    )

    // validar se a senha bate
    if (!isPasswordRight) {
      return left(new WrongCredentialsError())
    }

    // criar o access token usando o encrypter
    const accessToken = await this.encrypter.encrypt({
      sub: user.id,
    })

    // retornar usuário
    return right({ accessToken })
  }
}
