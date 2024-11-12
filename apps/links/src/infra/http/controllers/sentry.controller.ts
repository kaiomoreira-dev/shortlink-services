import { Public } from '@/infra/auth/public'
import { Controller, Get } from '@nestjs/common'

@Controller('')
@Public()
export class SentryController {
  constructor() {}

  @Get('/debug-sentry')
  getError() {
    throw new Error('My first Sentry error!')
  }
}
