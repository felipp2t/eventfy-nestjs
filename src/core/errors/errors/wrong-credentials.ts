import { UseCaseError } from '../errors'

export class WrongCredentials extends Error implements UseCaseError {
  constructor() {
    super('Email or password is incorrect')
  }
}
