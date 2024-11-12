import { EnvService } from '@/infra/env/env.service'

export class ShortUrl {
  value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): ShortUrl {
    return new ShortUrl(this.generateCode(value))
  }

  private static generateCode(value: string): string {
    const NODE_ENV = EnvService.getInstance().get('NODE_ENV')
    const API_DEVELOPMENT_URL = EnvService.getInstance().get(
      'API_DEVELOPMENT_URL',
    )
    const API_PRODUCTION_URL =
      EnvService.getInstance().get('API_PRODUCTION_URL')

    const API_URL =
      NODE_ENV === 'development' ? API_DEVELOPMENT_URL : API_PRODUCTION_URL

    let shortUrl = ''
    let shortCode = ''

    if (value.includes(API_URL)) {
      shortUrl = value
    } else {
      const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      for (let i = 0; i < 6; i++) {
        shortCode += chars.charAt(Math.floor(Math.random() * chars.length))
      }

      shortUrl = `${API_URL}/${shortCode}`
    }

    return shortUrl
  }
}
