import { FakeCrypto } from '@test/cryptography/fake-crypto'
import { makeAccount } from '@test/factories/make-account'
import { makeSession } from '@test/factories/make-session'
import { InMemoryAccountRepository } from '@test/in-memory/in-memory-account-repository'
import { InMemorySessionRepository } from '@test/in-memory/in-memory-session-repository'
import { getFutureDate } from 'src/core/utils/get-future-date'
import { getPastDate } from 'src/core/utils/get-past-date'
import { Descrypter } from '../cryptography/decrypter'
import { Encrypter } from '../cryptography/encrypter'
import { InvalidToken } from './errors/invalid-token'
import { RefreshTokenUseCase } from './refresh-token'

type SutOutput = {
  inMemoryAccountRepository: InMemoryAccountRepository
  inMemorySessionRepository: InMemorySessionRepository
  descrypter: Descrypter
  encrypter: Encrypter
  sut: RefreshTokenUseCase
}

const makeSut = (): SutOutput => {
  const fakeCrypto = new FakeCrypto()

  const inMemoryAccountRepository = new InMemoryAccountRepository()
  const inMemorySessionRepository = new InMemorySessionRepository()
  const descrypter: Descrypter = fakeCrypto
  const encrypter: Encrypter = fakeCrypto

  const sut = new RefreshTokenUseCase(
    inMemoryAccountRepository,
    inMemorySessionRepository,
    descrypter,
    encrypter
  )
  return {
    sut,
    inMemoryAccountRepository,
    inMemorySessionRepository,
    descrypter,
    encrypter,
  }
}

describe('Refresh Token', () => {
  it('should return a new refresh token', async () => {
    const {
      sut,
      encrypter,
      inMemoryAccountRepository,
      inMemorySessionRepository,
    } = makeSut()

    const account = makeAccount()

    const session = makeSession({
      accountId: account.id,
    })

    const payload = {
      sub: account.id.toString(),
      exp: getFutureDate(7),
    }

    const refreshToken = await encrypter.encrypt(payload)

    inMemoryAccountRepository.items.push(account)
    inMemorySessionRepository.items.push(session)

    const result = await sut.execute({ refreshToken })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemorySessionRepository.items).toHaveLength(1)
      expect(result.value.session.refreshToken).not.toBe(session.refreshToken)
    }
  })

  it('should return an invalid token error if the token is expired', async () => {
    const {
      sut,
      inMemoryAccountRepository,
      inMemorySessionRepository,
      encrypter,
    } = makeSut()

    const account = makeAccount()

    const session = makeSession({
      accountId: account.id,
      expiresIn: getPastDate(1),
    })

    const payload = {
      sub: account.id.toString(),
      exp: getPastDate(1),
    }

    const refreshToken = await encrypter.encrypt(payload)

    inMemoryAccountRepository.items.push(account)
    inMemorySessionRepository.items.push(session)

    const result = await sut.execute({ refreshToken })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidToken)
  })
})
