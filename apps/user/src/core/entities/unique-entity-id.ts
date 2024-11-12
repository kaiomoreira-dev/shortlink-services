import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
  private value: string

  toValue(): string {
    return this.value
  }

  toString(): string {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }
}
