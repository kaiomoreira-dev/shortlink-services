import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Link } from '@/domain/links/enterprise/entities/link'
import { Prisma, PrismaClient, Link as PrismaLink } from '.prisma/client'

export class PrismaLinkMapper {
  constructor(private prismaClient: PrismaClient) {}
  static toDomain(raw: PrismaLink): Link {
    return Link.create(
      {
        originalUrl: raw.originalUrl,
        shortUrl: raw.shortUrl,
        clicks: Number(raw.clicks),
        userId: raw.userId ? new UniqueEntityId(raw.userId) : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
      null,
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(link: Link): Prisma.LinkUncheckedCreateInput {
    return {
      id: link.id.toString(),
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl,
      clicks: link.clicks,
      userId: link.userId?.toString(),
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
      deletedAt: link.deletedAt,
    }
  }
}
