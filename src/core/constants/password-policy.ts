import { isStrongPassword } from '../utils/is-strong-password'

export const passwordPolicy = {
  validate: (value: string) => isStrongPassword(value),
  message:
    'Password must contain at least 8 characters, one number, one uppercase letter, one lowercase letter and one special character',
}
