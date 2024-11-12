import { UsecaseError } from '@/core/errors/use-case-error'

export class WrongCredentialsError extends Error implements UsecaseError {
  constructor() {
    super(`Credentials is not valid.`)
  }
}
