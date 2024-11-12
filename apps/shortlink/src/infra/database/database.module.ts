import { LinksRepository } from '@/domain/shortlink/application/repositories/links-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaLinksRepository } from '@/infra/database/prisma/repositories/prisma-links-reposity'
import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: LinksRepository,
      useClass: PrismaLinksRepository,
    },
  ],
  exports: [PrismaService, LinksRepository],
})
export class DatabaseModule {}
