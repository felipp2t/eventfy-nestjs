import { FakeCrypto } from '@test/cryptography/fake-crypto'
import { makeAuthProvider } from '@test/factories/make-auth-provider'
import { makeAuthToken } from '@test/factories/make-auth-token'
import { makeUser } from '@test/factories/make-user'
import { InMemoryAuthProviderRepository } from '@test/in-memory/in-memory-auth-provider-repository'
import { InMemoryAuthTokenRepository } from '@test/in-memory/in-memory-auth-token-repository'
import { InMemoryUserRepository } from '@test/in-memory/in-memory-user-repository'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { AuthenticateAccountByProviderUseCase } from './authenticate-account-by-provider'

type SutOutput = {
  sut: AuthenticateAccountByProviderUseCase
  inMemoryUserRepository: InMemoryUserRepository
  inMemoryAuthProviderRepository: InMemoryAuthProviderRepository
  inMemoryAuthTokenRepository: InMemoryAuthTokenRepository
  encrypter: FakeCrypto
}

const makeSut = (): SutOutput => {
  const inMemoryUserRepository = new InMemoryUserRepository()
  const inMemoryAuthProviderRepository = new InMemoryAuthProviderRepository()
  const inMemoryAuthTokenRepository = new InMemoryAuthTokenRepository()
  const encrypter = new FakeCrypto()

  const sut = new AuthenticateAccountByProviderUseCase(
    inMemoryUserRepository,
    inMemoryAuthProviderRepository,
    inMemoryAuthTokenRepository,
    encrypter
  )

  return {
    sut,
    inMemoryUserRepository,
    inMemoryAuthProviderRepository,
    inMemoryAuthTokenRepository,
    encrypter,
  }
}

describe('Authenticate account by provider use case', () => {
  it('should create a new account', async () => {
    const {
      sut,
      inMemoryUserRepository,
      inMemoryAuthProviderRepository,
      inMemoryAuthTokenRepository,
    } = makeSut()

    const response = await sut.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      provider: AUTH_METHOD.GOOGLE,
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryUserRepository.items[0]).not.toBeNull()
    expect(inMemoryAuthProviderRepository.items[0]).not.toBeNull()
    expect(inMemoryAuthTokenRepository.items[0]).not.toBeNull()
  })

  it('should authenticate an existing account', async () => {
    const {
      sut,
      inMemoryUserRepository,
      inMemoryAuthProviderRepository,
      inMemoryAuthTokenRepository,
    } = makeSut()

    const user = makeUser()
    const authProvider = makeAuthProvider({
      userId: user.id,
      provider: AUTH_METHOD.GOOGLE,
    })
    const authToken = makeAuthToken({
      userId: user.id,
      providerId: authProvider.id,
    })

    inMemoryUserRepository.items.push(user)
    inMemoryAuthProviderRepository.items.push(authProvider)
    inMemoryAuthTokenRepository.items.push(authToken)

    const response = await sut.execute({
      email: user.email,
      name: authProvider.name,
      provider: AUTH_METHOD.GOOGLE,
    })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(authToken.refreshToken).not.toEqual(
        response.value.token.refreshToken
      )
    }

    expect(inMemoryUserRepository.items).toHaveLength(1)
    expect(inMemoryAuthProviderRepository.items).toHaveLength(1)
    expect(inMemoryAuthTokenRepository.items).toHaveLength(1)
  })
})
