import { faker } from '@faker-js/faker'
import { FakeCrypto } from '@test/cryptography/fake-crypto'
import { makeAccount } from '@test/factories/make-account'
import { makeSession } from '@test/factories/make-session'
import { InMemoryAccountRepository } from '@test/in-memory/in-memory-account-repository'
import { InMemorySessionRepository } from '@test/in-memory/in-memory-session-repository'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { AuthenticateByProviderUseCase } from './authenticate-by-provider'

type SutOutput = {
  sut: AuthenticateByProviderUseCase
  inMemoryAccountRepository: InMemoryAccountRepository
  inMemorySessionRepository: InMemorySessionRepository
  encrypter: FakeCrypto
}

const makeSut = (): SutOutput => {
  const inMemoryAccountRepository = new InMemoryAccountRepository()
  const inMemorySessionRepository = new InMemorySessionRepository()
  const encrypter = new FakeCrypto()

  const sut = new AuthenticateByProviderUseCase(
    inMemoryAccountRepository,
    inMemorySessionRepository,
    encrypter
  )

  return {
    sut,
    inMemoryAccountRepository,
    inMemorySessionRepository,
    encrypter,
  }
}

describe('Authenticate account by provider use case', () => {
  it('should create a new account', async () => {
    const { sut, inMemoryAccountRepository, inMemorySessionRepository } =
      makeSut()

    const response = await sut.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      provider: AUTH_METHOD.GOOGLE,
      sub: faker.string.uuid(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryAccountRepository.items).toHaveLength(1)
    expect(inMemorySessionRepository.items).toHaveLength(1)
    expect(inMemoryAccountRepository.items[0]).not.toBeNull()
    expect(inMemorySessionRepository.items[0]).not.toBeNull()
  })

  it('should authenticate an existing account', async () => {
    const { sut, inMemoryAccountRepository, inMemorySessionRepository } =
      makeSut()

    const account = makeAccount({
      provider: AUTH_METHOD.GOOGLE,
      providerId: faker.string.uuid(),
    })

    const session = makeSession({ accountId: account.id })

    inMemoryAccountRepository.items.push(account)
    inMemorySessionRepository.items.push(session)

    const response = await sut.execute({
      email: account.email,
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

    expect(inMemoryAccountRepository.items).toHaveLength(1)
    expect(inMemorySessionRepository.items).toHaveLength(1)
  })
})
