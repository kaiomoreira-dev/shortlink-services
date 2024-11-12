import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UserProps {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}
export class User extends Entity<UserProps> {
  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email(): string {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email.toLocaleLowerCase()
    this.touch()
  }

  get password(): string {
    return this.props.password
  }

  // eslint-disable-next-line accessor-pairs
  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props?.updatedAt
  }

  get deletedAt(): Date | undefined {
    return this.props?.deletedAt
  }

  // Método para realizar o soft delete
  setDeletedAt() {
    this.props.deletedAt = new Date() // Define a data e hora atuais como data de exclusão
  }

  // Verificação de se o link está ativo ou não
  isActive(): boolean {
    return this.deletedAt === null
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: UniqueEntityId) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return user
  }
}
