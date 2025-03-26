import { Password } from '@domain/main/enterprise/entities/value-objects/password'
import { FakeCrypto } from '@test/cryptography/fake-crypto'
import { makeAccount } from '@test/factories/make-account'
import { InMemoryAccountRepository } from '@test/in-memory/in-memory-account-repository'
import { EmailVerificationForPasswordRecovery } from './email-verification-for-password-recovery'
import { UserNotFound } from './errors/user-not-found'

interface SutOutput {
  sut: EmailVerificationForPasswordRecovery
  inMemoryAccountRepository: InMemoryAccountRepository
  encrypter: FakeCrypto
}

const makeSut = (): SutOutput => {
  const inMemoryAccountRepository = new InMemoryAccountRepository()
  const encrypter = new FakeCrypto()

  const sut = new EmailVerificationForPasswordRecovery(
    inMemoryAccountRepository,
    encrypter
  )

  return {
    inMemoryAccountRepository,
    encrypter,
    sut,
  }
}

describe('Email verification for password recovery', () => {
  it('should return an error if the user is not found', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({ email: 'example@example.com' })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UserNotFound)
  })

  it('should return a token if the user is found', async () => {
    const { sut, inMemoryAccountRepository, encrypter } = makeSut()

    const account = makeAccount({
      email: 'johndoe@example.com',
      password: await Password.create('#Password123'),
    })

    inMemoryAccountRepository.items.push(account)

    const response = await sut.execute({ email: 'johndoe@example.com' })

    expect(response.isRight()).toBeTruthy()
    if (response.isRight()) {
      expect(response.value).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      )
    }
  })
})
