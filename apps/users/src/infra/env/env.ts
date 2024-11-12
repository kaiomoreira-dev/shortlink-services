import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  JWT_EXPIRES_IN: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  API_DEVELOPMENT_URL: z.string(),
  API_PRODUCTION_URL: z.string().optional(),
  SENTRY_DNS: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>
