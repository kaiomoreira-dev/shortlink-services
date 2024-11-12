import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from '@/infra/auth/jwt-strategy'
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
        const privateKey = config.get('JWT_PRIVATE_KEY')
        const expiresIn = config.get('JWT_EXPIRES_IN')

        return {
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
          // secret,
          signOptions: {
            algorithm: 'RS256',
            expiresIn,
          },
        }
      },
    }),
  ],
  providers: [JwtStrategy, EnvService],
})
export class AuthModule {}
