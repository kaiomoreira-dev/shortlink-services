import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { RegisterUserUsecase } from './register-user-usecase'
import { faker } from '@faker-js/faker'
import { FakerHasher } from 'test/cryptography/faker-hasher'
import { makeUser } from 'test/factories/make-user'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

let inMemoryUserRepository: InMemoryUsersRepository
let fakerHash: FakerHasher
let stu: RegisterUserUsecase

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    fakerHash = new FakerHasher()
    stu = new RegisterUserUsecase(inMemoryUserRepository, fakerHash)
  })

  it('should be able to register a new user', async () => {
    const user = makeUser()
    const result = await stu.execute(user)

    if (result.isRight()) {
      expect(result.isRight()).toBeTruthy()
      expect(result.value).toEqual({
        user: result.value.user,
      })
    }
  })

  it('should be able to register user with password hash', async () => {
    const result = await stu.execute({
      email: 'joeKlin@me.com',
      name: faker.person.fullName(),
      password: '159753',
    })

    const hashedPassword = await fakerHash.generate('159753')

    if (result.isRight()) {
      expect(result.isRight()).toBeTruthy()
      expect(inMemoryUserRepository.items[0].password).toEqual(hashedPassword)
    }
  })

  it('should not be able to register user with invalid email', async () => {
    const user = makeUser({
      email: 'joeKlin@me',
      password: '159753',
    })

    await inMemoryUserRepository.create(user)

    const result = await stu.execute({
      email: 'joeKlin@me',
      name: faker.person.fullName(),
      password: '159753',
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
    }
  })
})
