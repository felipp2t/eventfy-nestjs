import { FakeCrypto } from '@test/cryptography/fake-crypto'
import { makeUser } from '@test/factories/make-user'
import { InMemoryUserRepository } from '@test/in-memory/in-memory-user-repository'
import { Encrypter } from '../cryptography/encrypter'
import { UserNotFound } from './errors/user-not-found'
import { ValidateEmailUseCase } from './validate-email'

interface SutOutput {
  sut: ValidateEmailUseCase
  encrypter: Encrypter
  inMemoryUserRepository: InMemoryUserRepository
}

const makeSut = (): SutOutput => {
  const encrypter: Encrypter = new FakeCrypto()
  const inMemoryUserRepository = new InMemoryUserRepository()
  const sut = new ValidateEmailUseCase(inMemoryUserRepository, encrypter)
  return {
    sut,
    encrypter,
    inMemoryUserRepository,
  }
}

describe('Verify Email Use Case', () => {
  it('should return right with token if user is found', async () => {
    const { sut, inMemoryUserRepository } = makeSut()
    const user = makeUser({
      password: '123456',
    })

    inMemoryUserRepository.create(user)

    const response = await sut.execute({ email: user.email })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({
      token: expect.any(String),
    })
  })

  it('should return left if user is not found', async () => {
    const { sut } = makeSut()
    const response = await sut.execute({ email: 'johndoe@gmail.com' })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UserNotFound)
  })
})
