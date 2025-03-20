import { FakeCrypto } from '@test/cryptography/fake-crypto'
import { FakeHasher } from '@test/cryptography/fake-hasher'
import { makeAccount } from '@test/factories/make-account'
import { makeUser } from '@test/factories/make-user'
import { InMemoryAccountRepository } from '@test/in-memory/in-memory-account-repository'
import { InMemoryUserRepository } from '@test/in-memory/in-memory-user-repository'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import { Descrypter } from '../cryptography/decrypter'
import { Encrypter } from '../cryptography/encrypter'
import { HashGenerator } from '../cryptography/hash-generator'
import { InvalidToken } from './errors/invalid-token'
import { UserNotFound } from './errors/user-not-found'
import { RecoveryPasswordUseCase } from './recovery-password'
import { InvalidPasswordConfirmation } from './errors/invalid-password-confirmation'

type SutOutput = {
  inMemoryUserRepository: InMemoryUserRepository
  inMemoryAccountRepository: InMemoryAccountRepository
  descrypter: Descrypter
  encrypter: Encrypter
  hashGenerator: HashGenerator
  sut: RecoveryPasswordUseCase
}

const makeSut = (): SutOutput => {
  const fakeCrypto = new FakeCrypto()
  const inMemoryUserRepository = new InMemoryUserRepository()
  const inMemoryAccountRepository = new InMemoryAccountRepository()
  const descrypter: Descrypter = fakeCrypto
  const encrypter: Encrypter = fakeCrypto
  const hashGenerator: HashGenerator = new FakeHasher()
  const sut = new RecoveryPasswordUseCase(
    inMemoryUserRepository,
    inMemoryAccountRepository,
    hashGenerator,
    descrypter
  )

  return {
    sut,
    inMemoryUserRepository,
    inMemoryAccountRepository,
    hashGenerator,
    descrypter,
    encrypter,
  }
}

describe('Recovery password', () => {
  it('should return InvalidToken if the token is expired"', async () => {
    const {
      sut,
      encrypter,
      hashGenerator,
      inMemoryUserRepository,
      inMemoryAccountRepository,
    } = makeSut()
    const user = makeUser({
      password: await hashGenerator.hash('123456'),
    })

    const account = makeAccount({
      userId: user.id,
    })

    inMemoryUserRepository.items.push(user)
    inMemoryAccountRepository.items.push(account)

    const payload = {
      sub: user.id.toString(),
      exp: Math.floor((Date.now() - 60 * 60 * 1000) / 1000),
    }

    const token = await encrypter.encrypt(payload)

    const response = await sut.execute({
      token,
      password: '654321',
      passwordConfirmation: '654321',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(InvalidToken)
  })

  it('should return UserNotFound if the email was not registered', async () => {
    const {
      sut,
      encrypter,
      hashGenerator,
      inMemoryUserRepository,
      inMemoryAccountRepository,
    } = makeSut()
    const user = makeUser({
      password: await hashGenerator.hash('123456'),
    })

    const account = makeAccount({
      userId: user.id,
      provider: AUTH_METHOD.GOOGLE,
      providerId: '123456789',
    })

    inMemoryUserRepository.items.push(user)
    inMemoryAccountRepository.items.push(account)

    const payload = {
      sub: user.id.toString(),
      exp: Math.floor((Date.now() + 60 * 60 * 1000) / 1000),
    }

    const token = await encrypter.encrypt(payload)

    const response = await sut.execute({
      token,
      password: '654321',
      passwordConfirmation: '654321',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UserNotFound)
  })

  it("should return InvalidPasswordConfirmation if the password doesn't match the password confirmation", async () => {
    const {
      sut,
      encrypter,
      hashGenerator,
      inMemoryUserRepository,
      inMemoryAccountRepository,
    } = makeSut()
    const user = makeUser({
      password: await hashGenerator.hash('123456'),
    })

    const account = makeAccount({ userId: user.id })

    inMemoryUserRepository.items.push(user)
    inMemoryAccountRepository.items.push(account)

    const payload = {
      sub: user.id.toString(),
      exp: Math.floor((Date.now() + 60 * 60 * 1000) / 1000),
    }

    const token = await encrypter.encrypt(payload)

    const response = await sut.execute({
      token,
      password: '123456',
      passwordConfirmation: '654321',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(InvalidPasswordConfirmation)
  })
})
