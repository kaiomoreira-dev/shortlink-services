import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from '@/infra/env/env'
import { AuthModule } from '@/infra/auth/auth.module'
import { HttpModule } from '@/infra/http/http.module'
import { EnvModule } from '@/infra/env/env.module'
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup'
import { APP_FILTER } from '@nestjs/core'

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
