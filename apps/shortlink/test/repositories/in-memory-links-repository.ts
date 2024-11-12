import { PaginationParams } from '@/core/repositories/pagination-params'
import { LinksRepository } from '@/domain/shortlink/application/repositories/links-repository'
import { Link } from '@/domain/shortlink/enterprise/entities/link'
import { link } from 'fs'

export class InMemoryLinksRepository implements LinksRepository {
  links: Link[] = []

  async findByShortCode(shortCode: string): Promise<Link | null> {
    const link = this.links.find(
      (item) => item.shortUrl.value.slice(-6) === shortCode.slice(-6),
    )

    if (!link) {
      return null
    }

    return link
  }

  async findById(id: string): Promise<Link | null> {
    const link = this.links.find((item) => item.id === id)

    if (!link) {
      return null
    }

    return link
  }

  async findManyByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<Link[] | null> {
    const links = this.links
      .filter((link) => link.userId?.toValue() === userId)
      .reverse()
      .splice((page - 1) * 20, page * 20)

    if (link.length === 0) {
      return null
    }

    return links
  }

  async create(link: Link): Promise<Link> {
    this.links.push(link)

    return link
  }

  async delete(link: Link): Promise<void> {
    const findIndexLink = this.links.findIndex((item) => item.id === link.id)

    this.links[findIndexLink].setDeletedAt()
  }

  async save({ id, originalUrl, userId }: Link): Promise<Link> {
    const findIndexLink = this.links.findIndex((item) => item.id === id)

    this.links[findIndexLink].originalUrl = originalUrl

    return this.links[findIndexLink]
  }
}
