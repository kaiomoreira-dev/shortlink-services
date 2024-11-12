import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { AutheticateController } from '@/infra/http/controllers/auth/authenticate.controller'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { RegisterUserController } from '@/infra/http/controllers/users/register-user.controller'
import { EnvModule } from '../env/env.module'
import { AuthenticateUserUsecase } from '@/domain/user/usecases/auth/authenticate-user-usecase'
import { RegisterUserUsecase } from '@/domain/user/usecases/users/register-user-usecase'
import { SentryController } from './controllers/sentry.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [
    SentryController,
    AutheticateController,
    RegisterUserController,
  ],
  providers: [AuthenticateUserUsecase, RegisterUserUsecase],
})
export class HttpModule {}
