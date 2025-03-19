import { faker } from '@faker-js/faker'
import { FakeCrypto } from '@test/cryptography/fake-crypto'
import { makeAccount } from '@test/factories/make-account'
import { makeSession } from '@test/factories/make-session'
import { makeUser } from '@test/factories/make-user'
import { InMemoryAccountRepository } from '@test/in-memory/in-memory-account-repository'
import { InMemorySessionRepository } from '@test/in-memory/in-memory-session-repository'
import { InMemoryUserRepository } from '@test/in-memory/in-memory-user-repository'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { AuthenticateAccountByProviderUseCase } from './authenticate-account-by-provider'

type SutOutput = {
  sut: AuthenticateAccountByProviderUseCase
  inMemoryUserRepository: InMemoryUserRepository
  inMemoryAccountRepository: InMemoryAccountRepository
  inMemorySessionRepository: InMemorySessionRepository
  encrypter: FakeCrypto
}

const makeSut = (): SutOutput => {
  const inMemoryUserRepository = new InMemoryUserRepository()
  const inMemoryAccountRepository = new InMemoryAccountRepository()
  const inMemorySessionRepository = new InMemorySessionRepository()
  const encrypter = new FakeCrypto()

  const sut = new AuthenticateAccountByProviderUseCase(
    inMemoryUserRepository,
    inMemoryAccountRepository,
    inMemorySessionRepository,
    encrypter
  )

  return {
    sut,
    inMemoryUserRepository,
    inMemoryAccountRepository,
    inMemorySessionRepository,
    encrypter,
  }
}

describe('Authenticate account by provider use case', () => {
  it('should create a new account', async () => {
    const {
      sut,
      inMemoryUserRepository,
      inMemoryAccountRepository,
      inMemorySessionRepository,
    } = makeSut()

    const response = await sut.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      provider: AUTH_METHOD.GOOGLE,
      sub: faker.string.uuid(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryUserRepository.items[0]).not.toBeNull()
    expect(inMemoryAccountRepository.items[0]).not.toBeNull()
    expect(inMemorySessionRepository.items[0]).not.toBeNull()
  })

  it('should authenticate an existing account', async () => {
    const {
      sut,
      inMemoryUserRepository,
      inMemoryAccountRepository,
      inMemorySessionRepository,
    } = makeSut()

    const user = makeUser()

    const account = makeAccount({
      userId: user.id,
      provider: AUTH_METHOD.GOOGLE,
      providerId: faker.string.uuid(),
    })

    const session = makeSession({
      userId: user.id,
      accountId: account.id,
    })

    inMemoryUserRepository.items.push(user)
    inMemoryAccountRepository.items.push(account)
    inMemorySessionRepository.items.push(session)

    const response = await sut.execute({
      email: user.email,
      name: account.name,
      provider: AUTH_METHOD.GOOGLE,
      sub: account.providerId!,
    })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(session.refreshToken).not.toEqual(
        response.value.session.refreshToken
      )
    }

    expect(inMemoryUserRepository.items).toHaveLength(1)
    expect(inMemoryAccountRepository.items).toHaveLength(1)
    expect(inMemorySessionRepository.items).toHaveLength(1)
  })
})
