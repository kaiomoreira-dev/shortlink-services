import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { CreateShortLinkController } from '@/infra/http/controllers/links/create-link.controller'
import { RedirectToLinkUseCase } from '@/domain/shortlink/usecases/links/redirect-to-link'
import { RedirectToLinkController } from '@/infra/http/controllers/links/redirect-to-link.controller'
import { FetchLinkController } from './controllers/links/fetch-links.controller'
import { FetchLinkUseCase } from '@/domain/shortlink/usecases/links/fetch-link'
import { DeleteShortLinkController } from './controllers/links/delete-link.controller'
import { DeleteShortLinkUseCase } from '@/domain/shortlink/usecases/links/delete-link'
import { EditShortLinkController } from './controllers/links/edit-link.controller'
import { EditShortLinkUseCase } from '@/domain/shortlink/usecases/links/edit-link'
import { EnvModule } from '../env/env.module'
import { CreateShortLinkUseCase } from '@/domain/shortlink/usecases/links/create-short-link'
import { SentryController } from './controllers/sentry.controller'

@Module({
  imports: [DatabaseModule, EnvModule],
  controllers: [
    SentryController,
    CreateShortLinkController,
    FetchLinkController,
    RedirectToLinkController,
    DeleteShortLinkController,
    EditShortLinkController,
  ],
  providers: [
    FetchLinkUseCase,
    RedirectToLinkUseCase,
    DeleteShortLinkUseCase,
    EditShortLinkUseCase,
    CreateShortLinkUseCase,
  ],
})
export class HttpModule {}
