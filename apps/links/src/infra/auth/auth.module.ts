import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from '@/infra/auth/jwt-strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth-guard'
import { EnvService } from '@/infra/env/env.service'
import { EnvModule } from '@/infra/env/env.module'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(config: EnvService) {
        const publicKey = config.get('JWT_PUBLIC_KEY')

        return {
          publicKey: Buffer.from(publicKey, 'base64'),
          verifyOptions: {
            algorithms: ['RS256'],
          },
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
