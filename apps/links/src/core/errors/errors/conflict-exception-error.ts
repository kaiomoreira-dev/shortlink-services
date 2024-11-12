import { UsecaseError } from '@/core/errors/use-case-error'

export class ConflictExceptionError extends Error implements UsecaseError {
  constructor() {
    super('Conflict exception')
  }
}
