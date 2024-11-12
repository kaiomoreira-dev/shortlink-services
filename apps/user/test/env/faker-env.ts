import { EnvService } from '@/infra/env/env.service'
import { ConfigService } from '@nestjs/config'

class MockConfigService {
  private mockEnv = {
    NODE_ENV: 'development',
    API_DEVELOPMENT_URL: 'http://localhost:3000',
    API_PRODUCTION_URL: 'http://production-url.com',
  }

  get<T extends keyof typeof this.mockEnv>(key: T): (typeof this.mockEnv)[T] {
    return this.mockEnv[key]
  }
}

export class MockEnvService extends EnvService {
  constructor() {
    super(new MockConfigService() as unknown as ConfigService)
  }
}
