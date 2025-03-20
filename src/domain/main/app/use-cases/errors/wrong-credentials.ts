import { UseCaseError } from 'src/core/errors/errors'

export class WrongCredentials extends Error implements UseCaseError {
  constructor() {
    super('Email or password is incorrect')
  }
}
