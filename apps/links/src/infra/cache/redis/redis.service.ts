import { EnvService } from '@/infra/env/env.service'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private nextErrorMessageTime: Date | null

  constructor(envService: EnvService) {
    super({
      host: envService.get('REDIS_HOST'),
      port: Number(envService.get('REDIS_PORT')),
      db: Number(envService.get('REDIS_DB')),
      password: envService.get('REDIS_PASSWORD'),
      username: envService.get('REDIS_USERNAME'),
    })

    this.on('error', (error) => {
      const currentDate = new Date()

      if (
        !this.nextErrorMessageTime ||
        currentDate > this.nextErrorMessageTime
      ) {
        const nextErrorMessageAlert = new Date()
        nextErrorMessageAlert.setMinutes(nextErrorMessageAlert.getMinutes() + 5)

        this.nextErrorMessageTime = nextErrorMessageAlert

        console.error('Redis connection error:', error)
      }
    })

    this.on('ready', () => {
      console.info('[Cache] ready')
      this.nextErrorMessageTime = null
    })
  }

  onModuleDestroy() {
    return this.disconnect()
  }
}
