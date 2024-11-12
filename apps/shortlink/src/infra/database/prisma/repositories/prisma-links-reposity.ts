import { PaginationParams } from '@/core/repositories/pagination-params'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaLinkMapper } from '../mappers/prisma-links-mapper'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { LinksRepository } from '@/domain/shortlink/application/repositories/links-repository'
import { Link } from '@/domain/shortlink/enterprise/entities/link'

@Injectable()
export class PrismaLinksRepository implements LinksRepository {
  constructor(
    private prisma: PrismaService,
    private cacheRepository: CacheRepository,
  ) {}

  async findById(id: string): Promise<Link | null> {
    const link = await this.prisma.link.findUnique({
      where: {
        id,
      },
    })

    if (!link) {
      return null
    }

    return PrismaLinkMapper.toDomain(link)
  }

  async findByShortCode(shortUrl: string): Promise<Link | null> {
    // // verificar se ja existe um cache para esse link
    // const cachedLink = await this.cacheRepository.get(`link:${shortUrl}`)

    // // se existir, retornar o cache
    // if (cachedLink) {
    //   const link = JSON.parse(cachedLink)

    //   return PrismaLinkMapper.toDomain(link)
    // }

    const link = await this.prisma.link.findUnique({
      where: {
        shortUrl,
      },
    })

    if (!link) {
      return null
    }

    // await this.cacheRepository.set(
    //   `link:${link.shortUrl}`,
    //   JSON.stringify(link),
    // )

    const linkDetails = PrismaLinkMapper.toDomain(link)

    return linkDetails
  }

  async findManyByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<Link[]> {
    const links = await this.prisma.link.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (params.page - 1) * params.page,
    })

    return links.map(PrismaLinkMapper.toDomain)
  }

  async create(link: Link): Promise<Link> {
    const data = PrismaLinkMapper.toPrisma(link)

    const createLink = await this.prisma.link.create({
      data,
    })

    return PrismaLinkMapper.toDomain(createLink)
  }

  async save(link: Link): Promise<Link> {
    const data = PrismaLinkMapper.toPrisma(link)

    const createLink = await this.prisma.link.update({
      where: {
        id: data.id,
      },
      data,
    })
    // Limpar cache do link
    // await this.cacheRepository.delete(`link:${createLink.shortUrl}:details`)

    const linkDetails = PrismaLinkMapper.toDomain(createLink)

    return linkDetails
  }
}
