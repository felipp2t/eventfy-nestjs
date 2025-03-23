import { UseCaseError } from "src/core/errors/errors";

export class EmailAlreadyInUse extends Error implements UseCaseError {
  constructor() {
    super('The email is already in use')
  }
}
