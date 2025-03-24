import { Password } from '@domain/main/enterprise/entities/value-objects/password'
import { FakeCrypto } from '@test/cryptography/fake-crypto'
import { makeAccount } from '@test/factories/make-account'
import { InMemoryAccountRepository } from '@test/in-memory/in-memory-account-repository'
import { InMemorySessionRepository } from '@test/in-memory/in-memory-session-repository'
import { AuthenticateByEmail } from './authenticate-by-email'
import { WrongCredentials } from './errors/wrong-credentials'

type SutOutput = {
  sut: AuthenticateByEmail
  inMemoryAccountRepository: InMemoryAccountRepository
  inMemorySessionRepository: InMemorySessionRepository
  encrypter: FakeCrypto
}

const makeSut = (): SutOutput => {
  const inMemoryAccountRepository = new InMemoryAccountRepository()
  const inMemorySessionRepository = new InMemorySessionRepository()
  const encrypter = new FakeCrypto()
  const sut = new AuthenticateByEmail(
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

describe('Authenticate account by email', () => {
  it('should return an session on success', async () => {
    const { sut, inMemoryAccountRepository } = makeSut()

    const account = makeAccount({
      password: await Password.create('#Password123'),
    })

    inMemoryAccountRepository.create(account)

    const response = await sut.execute({
      email: account.email,
      password: '#Password123',
    })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value).toEqual(
        expect.objectContaining({
          session: expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          }),
        })
      )
    }
  })

  it("should return a WrongCredentials error if the account doesn't exist", async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(WrongCredentials)
  })

  it('should return a WrongCredentials error if the password is incorrect', async () => {
    const { sut, inMemoryAccountRepository } = makeSut()

    const account = makeAccount({
      password: await Password.create('#Password123'),
    })

    inMemoryAccountRepository.create(account)

    const response = await sut.execute({
      email: account.email,
      password: '#Password',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(WrongCredentials)
  })
})
