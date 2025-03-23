import { passwordPolicy } from 'src/core/constants/password-policy'
import { Password } from './password'

describe('Password', () => {
  it('should create a password', async () => {
    const password = await Password.create('#Usuario123')
    expect(password).toBeDefined()
    expect(password.getHash()).toBeDefined()
  })

  it('should throw error if password is weak', async () => {
    await expect(Password.create('123')).rejects.toThrow(passwordPolicy.message)
  })
})
