import { Entity } from '@/core/entities/entity'
import { ShortUrl } from './value-objects/short-code-link'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface LinkProps {
  originalUrl: string
  shortUrl: ShortUrl
  userId?: UniqueEntityId | null
  clicks: number
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class Link extends Entity<LinkProps> {
  get shortUrl(): ShortUrl {
    return this.props.shortUrl
  }

  get clicks(): number {
    return this.props.clicks
  }

  get originalUrl(): string {
    return this.props.originalUrl
  }

  set originalUrl(originalUrl: string) {
    this.props.originalUrl = originalUrl
    this.touch()
  }

  get userId(): UniqueEntityId | undefined | null {
    return this.props.userId
  }

  set userId(userId: UniqueEntityId) {
    this.props.userId = userId
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

  countClick() {
    this.props.clicks++
    this.touch()
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<LinkProps, 'createdAt' | 'clicks' | 'shortUrl'>,
    id?: UniqueEntityId,
  ) {
    const link = new Link(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        clicks: props.clicks ?? 0,
        shortUrl: props.shortUrl ?? ShortUrl.create(props.originalUrl), // criar env variavel mais pra frente
        userId: props.userId ?? null,
        deletedAt: props.deletedAt ?? null,
        updatedAt: props.updatedAt ?? null,
      },
      id,
    )

    return link
  }
}
