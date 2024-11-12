import { Link } from '@/domain/shortlink/enterprise/entities/link'

export class HttpLinksPresenter {
  static toHttp(link: Link) {
    return {
      id: link.id.toString(),
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl.value,
      clicks: link.clicks,
      userId: link.userId?.toString(),
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
      deletedAt: link.deletedAt,
    }
  }
}
