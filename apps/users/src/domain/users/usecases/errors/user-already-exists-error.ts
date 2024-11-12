import { UsecaseError } from '@/core/errors/use-case-error'

export class UserAlreadyExistsError extends Error implements UsecaseError {
  constructor(indentifier: string) {
    super(`User ${indentifier} already exists.`)
  }
}
