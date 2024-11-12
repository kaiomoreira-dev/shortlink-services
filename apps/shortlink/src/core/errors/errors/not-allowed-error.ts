import { UsecaseError } from '@/core/errors/use-case-error'

export class NotAllowedError extends Error implements UsecaseError {
  constructor() {
    super('Not allowed')
  }
}
