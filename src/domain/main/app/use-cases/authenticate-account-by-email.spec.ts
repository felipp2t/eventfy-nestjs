import { Password } from '@domain/main/enterprise/entities/value-objects/password'
import { FakeCrypto } from '@test/cryptography/fake-crypto'
import { FakeHasher } from '@test/cryptography/fake-hasher'
import { makeAccount } from '@test/factories/make-account'
import { makeSession } from '@test/factories/make-session'
import { makeUser } from '@test/factories/make-user'
import { InMemoryAccountRepository } from '@test/in-memory/in-memory-account-repository'
import { InMemorySessionRepository } from '@test/in-memory/in-memory-session-repository'
import { InMemoryUserRepository } from '@test/in-memory/in-memory-user-repository'
import { AuthenticateAccountByEmailUseCase } from './authenticate-account-by-email'

type SutOutput = {
  sut: AuthenticateAccountByEmailUseCase
  inMemoryUserRepository: InMemoryUserRepository
  inMemoryAccountRepository: InMemoryAccountRepository
  inMemorySessionRepository: InMemorySessionRepository
  encrypter: FakeCrypto
}

const makeSut = (): SutOutput => {
  const inMemoryUserRepository = new InMemoryUserRepository()
  const inMemoryAccountRepository = new InMemoryAccountRepository()
  const inMemorySessionRepository = new InMemorySessionRepository()
  const fakeHasher = new FakeHasher()
  const encrypter = new FakeCrypto()
  const sut = new AuthenticateAccountByEmailUseCase(
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

describe('Authenticate account by email', () => {
  it('should return an session on success', async () => {
    const {
      sut,
      inMemoryUserRepository,
      inMemoryAccountRepository,
      inMemorySessionRepository,
    } = makeSut()

    const password = await Password.create('#Usuario1')
    const user = makeUser({ password })

    const account = makeAccount({
      userId: user.id,
    })

    const session = makeSession({
      accountId: account.id,
      userId: user.id,
    })

    inMemoryUserRepository.items.push(user)
    inMemoryAccountRepository.items.push(account)
    inMemorySessionRepository.items.push(session)

    const response = await sut.execute({
      email: user.email,
      password: '#Usuario1',
    })

    expect(response.isRight()).toBe(true)
    expect(inMemorySessionRepository.items[0].userId).toEqual(
      inMemoryUserRepository.items[0].id
    )
    expect(inMemorySessionRepository.items[0].accountId).toEqual(
      inMemoryAccountRepository.items[0].id
    )
    if (response.isRight()) {
      expect(response.value.session).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      })
    }
  })
})
