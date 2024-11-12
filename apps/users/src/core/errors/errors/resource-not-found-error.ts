import { UsecaseError } from '@/core/errors/use-case-error'

export class ResourceNotFoundError extends Error implements UsecaseError {
  constructor() {
    super('Resource not found')
  }
}
