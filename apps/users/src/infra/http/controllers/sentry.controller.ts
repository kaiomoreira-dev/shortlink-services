import { Controller, Get } from '@nestjs/common'

@Controller('')
export class SentryController {
  constructor() {}

  @Get('/debug-sentry')
  getError() {
    throw new Error('My first Sentry error!')
  }
}
