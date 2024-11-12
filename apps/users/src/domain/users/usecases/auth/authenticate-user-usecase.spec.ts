import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakerHasher } from 'test/cryptography/faker-hasher'
import { FakerEncrypter } from 'test/cryptography/faker-encrypter'
import { AuthenticateUserUsecase } from './authenticate-user-usecase'
import { makeUser } from 'test/factories/make-user'
import { WrongCredentialsError } from '../errors/wrong-credentials-erros'

let inMemoryUserRepository: InMemoryUsersRepository
let fakerHash: FakerHasher
let fakerEncrypt: FakerEncrypter
let stu: AuthenticateUserUsecase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    fakerHash = new FakerHasher()
    fakerEncrypt = new FakerEncrypter()
    stu = new AuthenticateUserUsecase(
      inMemoryUserRepository,
      fakerHash,
      fakerEncrypt,
    )
  })

  it('should be able to authenticate ', async () => {
    const user = makeUser({
      email: 'test@me.com',
      password: await fakerHash.generate('7895123'),
    })

    await inMemoryUserRepository.create(user)

    const result = await stu.execute({
      email: 'test@me.com',
      password: '7895123',
    })
    if (result.isRight()) {
      expect(result.isRight()).toBeTruthy()
      // expect(result.value).toEqual({
      //   user: result.value,
      // })
    }
  })

  it('should not be able to authenticate with invalid email', async () => {
    const result = await stu.execute({
      email: 'test@me.com',
      password: '7895123',
    })
    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(WrongCredentialsError)
    }
  })

  it('should not be able to authenticate with invalid password', async () => {
    const user = makeUser({
      email: 'test@me.com',
      password: await fakerHash.generate('7895123'),
    })

    await inMemoryUserRepository.create(user)

    const result = await stu.execute({
      email: 'test@me.com',
      password: '123456',
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(WrongCredentialsError)
    }
  })
})
