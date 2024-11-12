import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { CreateLinksController } from '@/infra/http/controllers/links/create-link.controller'
import { RedirectToLinkUseCase } from '@/domain/links/usecases/links/redirect-to-link'
import { RedirectToLinkController } from '@/infra/http/controllers/links/redirect-to-link.controller'
import { FetchLinkController } from './controllers/links/fetch-links.controller'
import { FetchLinkUseCase } from '@/domain/links/usecases/links/fetch-link'
import { DeleteLinksController } from './controllers/links/delete-link.controller'
import { DeleteLinksUseCase } from '@/domain/links/usecases/links/delete-link'
import { EditLinksController } from './controllers/links/edit-link.controller'
import { EditLinksUseCase } from '@/domain/links/usecases/links/edit-link'
import { EnvModule } from '../env/env.module'
import { CreateLinksUseCase } from '@/domain/links/usecases/links/create-short-link'
import { SentryController } from './controllers/sentry.controller'

@Module({
  imports: [DatabaseModule, EnvModule],
  controllers: [
    SentryController,
    CreateLinksController,
    FetchLinkController,
    RedirectToLinkController,
    DeleteLinksController,
    EditLinksController,
  ],
  providers: [
    FetchLinkUseCase,
    RedirectToLinkUseCase,
    DeleteLinksUseCase,
    EditLinksUseCase,
    CreateLinksUseCase,
  ],
})
export class HttpModule {}
