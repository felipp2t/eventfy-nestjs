import { EmailAlreadyInUse } from '@domain/main/app/use-cases/errors/email-already-in-use'
import { FakeCrypto } from '@test/cryptography/fake-crypto'
import { FakeHasher } from '@test/cryptography/fake-hasher'
import { InMemoryAccountRepository } from '@test/in-memory/in-memory-account-repository'
import { InMemoryUserRepository } from '@test/in-memory/in-memory-user-repository'
import { CreateAccountUseCase } from './create-account-by-email'

type SutOutput = {
  sut: CreateAccountUseCase
  inMemoryUserRepository: InMemoryUserRepository
  inMemoryAccountRepository: InMemoryAccountRepository
  hashGenerator: FakeHasher
  encrypter: FakeCrypto
}

const makeSut = (): SutOutput => {
  const inMemoryUserRepository = new InMemoryUserRepository()
  const inMemoryAccountRepository = new InMemoryAccountRepository()
  const hashGenerator = new FakeHasher()
  const encrypter = new FakeCrypto()
  const sut = new CreateAccountUseCase(
    inMemoryUserRepository,
    inMemoryAccountRepository,
    hashGenerator,
    encrypter
  )

  return {
    sut,
    inMemoryUserRepository,
    inMemoryAccountRepository,
    hashGenerator,
    encrypter,
  }
}

describe('Create Account', () => {
  it('should create a new account', async () => {
    const { sut, inMemoryUserRepository } = makeSut()

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items).toHaveLength(1)
  })

  it("shouldn't create a new account if the email is already in use", async () => {
    const { sut } = makeSut()

    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '#Usuario1',
    })

    const result = await sut.execute({
      name: 'Alice',
      email: 'johndoe@example.com',
      password: '#Usuario1',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(EmailAlreadyInUse)
  })
})
