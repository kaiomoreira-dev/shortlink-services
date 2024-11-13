import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface LinkProps {
  originalUrl: string
  shortUrl: string
  userId?: UniqueEntityId | null
  clicks: number
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class Link extends Entity<LinkProps> {
  get shortUrl(): string {
    return this.props.shortUrl
  }

  get clicks(): number {
    return this.props.clicks
  }

  set clicks(clicks: number) {
    this.props.clicks = clicks
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

  private static generateShortUrl(
    originalUrl: string,
    baseUrl: string,
  ): string {
    let shortUrl = ''
    let shortCode = ''

    if (originalUrl.includes(baseUrl)) {
      shortUrl = originalUrl
    } else {
      const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      for (let i = 0; i < 6; i++) {
        shortCode += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      shortUrl = `${baseUrl}/${shortCode}`
    }

    return shortUrl
  }

  static create(
    props: Optional<LinkProps, 'createdAt' | 'clicks' | 'shortUrl'>,
    baseUrl?: string | null, // Passa a URL base para gerar o shortUrl
    id?: UniqueEntityId,
  ) {
    const link = new Link(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        clicks: props.clicks ?? 0,
        shortUrl:
          props.shortUrl ?? Link.generateShortUrl(props.originalUrl, baseUrl),
        userId: props.userId ?? null,
        deletedAt: props.deletedAt ?? null,
        updatedAt: props.updatedAt ?? null,
      },
      id,
    )

    return link
  }
}
