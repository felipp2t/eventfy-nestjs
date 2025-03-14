import { FakeEncrypter } from '@test/cryptography/fake-encrypter'
import { FakeHasher } from '@test/cryptography/fake-hasher'
import { InMemoryAuthProviderRepository } from '@test/in-memory/in-memory-auth-provider-repository'
import { InMemoryAuthTokenRepository } from '@test/in-memory/in-memory-auth-token-repository'
import { InMemoryUserRepository } from '@test/in-memory/in-memory-user-repository'
import { EmailAlreadyInUse } from 'src/core/errors/errors/email-already-in-use'
import { CreateAccountUseCase } from './create-account-by-email'

type SutOutput = {
  sut: CreateAccountUseCase
  inMemoryUserRepository: InMemoryUserRepository
  inMemoryAuthProviderRepository: InMemoryAuthProviderRepository
  inMemoryAuthTokenRepository: InMemoryAuthTokenRepository
  hashGenerator: FakeHasher
  encrypter: FakeEncrypter
}

const makeSut = (): SutOutput => {
  const inMemoryUserRepository = new InMemoryUserRepository()
  const inMemoryAuthProviderRepository = new InMemoryAuthProviderRepository()
  const inMemoryAuthTokenRepository = new InMemoryAuthTokenRepository()
  const hashGenerator = new FakeHasher()
  const encrypter = new FakeEncrypter()
  const sut = new CreateAccountUseCase(
    inMemoryUserRepository,
    inMemoryAuthProviderRepository,
    inMemoryAuthTokenRepository,
    hashGenerator,
    encrypter
  )

  return {
    sut,
    inMemoryUserRepository,
    inMemoryAuthProviderRepository,
    inMemoryAuthTokenRepository,
    hashGenerator,
    encrypter,
  }
}

describe('Create Account', () => {
  it('should create a new account', async () => {
    const { sut, inMemoryUserRepository, inMemoryAuthTokenRepository } =
      makeSut()

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })
    expect(inMemoryAuthTokenRepository.items[0].userId.toValue()).toEqual(
      inMemoryUserRepository.items[0].id.toValue()
    )
  })

  it("shouldn't create a new account if the email is already in use", async () => {
    const { sut } = makeSut()

    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const result = await sut.execute({
      name: 'Alice',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyInUse)
  })
})
