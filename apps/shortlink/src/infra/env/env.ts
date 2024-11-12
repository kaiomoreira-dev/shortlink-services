import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3335),
  API_DEVELOPMENT_URL: z.string(),
  API_PRODUCTION_URL: z.string().optional(),
  JWT_PUBLIC_KEY: z.string(),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
  REDIS_PASSWORD: z.string().optional().default(''),
  REDIS_USERNAME: z.string().optional().default('default'),
  SENTRY_DNS: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>
