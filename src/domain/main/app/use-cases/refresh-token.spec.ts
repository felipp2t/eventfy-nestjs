import { faker } from '@faker-js/faker'
import { FakeCrypto } from '@test/cryptography/fake-crypto'
import { makeAuthProvider } from '@test/factories/make-auth-provider'
import { makeAuthToken } from '@test/factories/make-auth-token'
import { makeUser } from '@test/factories/make-user'
import { InMemoryAuthProviderRepository } from '@test/in-memory/in-memory-auth-provider-repository'
import { InMemoryAuthTokenRepository } from '@test/in-memory/in-memory-auth-token-repository'
import { InMemoryUserRepository } from '@test/in-memory/in-memory-user-repository'
import { Descrypter } from '../cryptography/decrypter'
import { Encrypter } from '../cryptography/encrypter'
import { InvalidToken } from './errors/invalid-token'
import { RefreshTokenUseCase } from './refresh-token'

type SutOutput = {
  inMemoryUserRepository: InMemoryUserRepository
  inMemoryAuthProviderRepository: InMemoryAuthProviderRepository
  inMemoryAuthTokenRepository: InMemoryAuthTokenRepository
  descrypter: Descrypter
  encrypter: Encrypter
  sut: RefreshTokenUseCase
}

const makeSut = (): SutOutput => {
  const fakeCrypto = new FakeCrypto()

  const inMemoryUserRepository = new InMemoryUserRepository()
  const inMemoryAuthProviderRepository = new InMemoryAuthProviderRepository()
  const inMemoryAuthTokenRepository = new InMemoryAuthTokenRepository()
  const descrypter: Descrypter = fakeCrypto
  const encrypter: Encrypter = fakeCrypto

  const sut = new RefreshTokenUseCase(
    inMemoryUserRepository,
    inMemoryAuthTokenRepository,
    descrypter,
    encrypter
  )
  return {
    sut,
    inMemoryUserRepository,
    inMemoryAuthProviderRepository,
    inMemoryAuthTokenRepository,
    descrypter,
    encrypter,
  }
}

describe('Refresh Token', () => {
  it('should return a new refresh token', async () => {
    const {
      sut,
      inMemoryUserRepository,
      inMemoryAuthProviderRepository,
      inMemoryAuthTokenRepository,
    } = makeSut()
    const user = makeUser({
      password: faker.internet.password(),
    })
    const provider = makeAuthProvider({
      userId: user.id,
    })

    const token = makeAuthToken({
      userId: user.id,
      providerId: provider.id,
    })

    inMemoryUserRepository.items.push(user)
    inMemoryAuthProviderRepository.items.push(provider)
    inMemoryAuthTokenRepository.items.push(token)

    const result = await sut.execute({
      refreshToken: token.refreshToken,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryAuthTokenRepository.items).toHaveLength(1)
      expect(result.value.token.refreshToken).not.toBe(token.refreshToken)
    }
  })

  it('should return an invalid token error if the token is expired', async () => {
    const {
      sut,
      inMemoryUserRepository,
      inMemoryAuthProviderRepository,
      inMemoryAuthTokenRepository,
    } = makeSut()

    const user = makeUser({
      password: faker.internet.password(),
    })

    const provider = makeAuthProvider({
      userId: user.id,
    })

    const token = makeAuthToken({
      userId: user.id,
      providerId: provider.id,
      expiresIn: new Date(new Date().setDate(new Date().getDate() - 0.1)),
    })

    inMemoryUserRepository.items.push(user)
    inMemoryAuthProviderRepository.items.push(provider)
    inMemoryAuthTokenRepository.items.push(token)

    const result = await sut.execute({
      refreshToken: token.refreshToken,
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidToken)
    }
  })
})
