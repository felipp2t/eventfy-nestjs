import { EmailAlreadyInUse } from 'core/errors/errors/email-already-in-use'
import { FakeEncrypter } from 'infra/cryptography/fake-encrypter'
import { FakeHasher } from 'infra/cryptography/fake-hasher'
import { InMemoryAuthProviderRepository } from '../../../../../test/in-memory/in-memory-auth-provider-repository'
import { InMemoryAuthTokenRepository } from '../../../../../test/in-memory/in-memory-auth-token-repository'
import { InMemoryUserRepository } from '../../../../../test/in-memory/in-memory-user-repository'
import { CreateAccountUseCase } from './create-account-by-email'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryAuthProviderRepository: InMemoryAuthProviderRepository
let inMemoryAuthTokenRepository: InMemoryAuthTokenRepository
let hashGenerator: FakeHasher
let encrypter: FakeEncrypter
let sut: CreateAccountUseCase

describe('Create Account', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryAuthProviderRepository = new InMemoryAuthProviderRepository()
    inMemoryAuthTokenRepository = new InMemoryAuthTokenRepository()
    hashGenerator = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new CreateAccountUseCase(
      inMemoryUserRepository,
      inMemoryAuthProviderRepository,
      inMemoryAuthTokenRepository,
      hashGenerator,
      encrypter
    )
  })

  it('should create a new account', async () => {
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
