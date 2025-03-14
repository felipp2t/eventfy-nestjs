import { FakeEncrypter } from '@test/cryptography/fake-encrypter'
import { FakeHasher } from '@test/cryptography/fake-hasher'
import { makeAuthProvider } from '@test/factories/make-auth-provider'
import { makeAuthToken } from '@test/factories/make-auth-token'
import { makeUser } from '@test/factories/make-user'
import { InMemoryAuthProviderRepository } from '@test/in-memory/in-memory-auth-provider-repository'
import { InMemoryAuthTokenRepository } from '@test/in-memory/in-memory-auth-token-repository'
import { InMemoryUserRepository } from '@test/in-memory/in-memory-user-repository'
import { AuthenticateAccountByEmailUseCase } from './authenticate-account-by-email'

type SutOutput = {
  sut: AuthenticateAccountByEmailUseCase
  inMemoryUserRepository: InMemoryUserRepository
  inMemoryAuthProviderRepository: InMemoryAuthProviderRepository
  inMemoryAuthTokenRepository: InMemoryAuthTokenRepository
  fakeHasher: FakeHasher
  encrypter: FakeEncrypter
}

const makeSut = (): SutOutput => {
  const inMemoryUserRepository = new InMemoryUserRepository()
  const inMemoryAuthProviderRepository = new InMemoryAuthProviderRepository()
  const inMemoryAuthTokenRepository = new InMemoryAuthTokenRepository()
  const fakeHasher = new FakeHasher()
  const encrypter = new FakeEncrypter()
  const sut = new AuthenticateAccountByEmailUseCase(
    inMemoryUserRepository,
    inMemoryAuthProviderRepository,
    inMemoryAuthTokenRepository,
    fakeHasher,
    encrypter
  )

  return {
    sut,
    inMemoryUserRepository,
    inMemoryAuthProviderRepository,
    inMemoryAuthTokenRepository,
    fakeHasher,
    encrypter,
  }
}

describe('Authenticate account by email', () => {
  it('should return an access token on success', async () => {
    const {
      sut,
      fakeHasher,
      inMemoryUserRepository,
      inMemoryAuthProviderRepository,
      inMemoryAuthTokenRepository,
    } = makeSut()

    const user = makeUser({
      password: await fakeHasher.hash('123456'),
    })

    const authProvider = makeAuthProvider({
      userId: user.id,
    })

    const authToken = makeAuthToken({
      providerId: authProvider.id,
      userId: user.id,
      days: 7,
    })

    inMemoryUserRepository.items.push(user)
    inMemoryAuthProviderRepository.items.push(authProvider)
    inMemoryAuthTokenRepository.items.push(authToken)

    const response = await sut.execute({
      email: user.email,
      password: '123456',
    })

    expect(response.isRight()).toBe(true)
    expect(inMemoryAuthTokenRepository.items[0].userId).toEqual(
      inMemoryUserRepository.items[0].id
    )
    expect(inMemoryAuthTokenRepository.items[0].providerId).toEqual(
      inMemoryAuthProviderRepository.items[0].id
    )
    if (response.isRight()) {
      expect(response.value.token).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      })
    }
  })
})
