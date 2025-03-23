import { EmailAlreadyInUse } from '@domain/main/app/use-cases/errors/email-already-in-use'
import { InMemoryAccountRepository } from '@test/in-memory/in-memory-account-repository'
import { CreateAccountByEmailUseCase } from './create-account-by-email'

type SutOutput = {
  sut: CreateAccountByEmailUseCase
  inMemoryAccountRepository: InMemoryAccountRepository
}

const makeSut = (): SutOutput => {
  const inMemoryAccountRepository = new InMemoryAccountRepository()
  const sut = new CreateAccountByEmailUseCase(inMemoryAccountRepository)

  return {
    sut,
    inMemoryAccountRepository,
  }
}

describe('Create Account', () => {
  it('should create a new account', async () => {
    const { sut, inMemoryAccountRepository } = makeSut()

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '#Usuario123',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAccountRepository.items).toHaveLength(1)
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
