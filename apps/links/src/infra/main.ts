import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { connectToSentry } from './http/monitoring/sentry/sentry'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Habilita o CORS com configurações
  app.enableCors({
    origin: '*', // Define os domínios permitidos, ou use '*' para todos os domínios
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type, Authorization', // Headers permitidos
  })

  const configService = app.get(EnvService)

  // Configura o Sentry
  connectToSentry(configService.get('SENTRY_DNS'))

  // Configura o Swagger
  const config = new DocumentBuilder()
    .setTitle('Links API')
    .setDescription('The links API description')
    .setVersion('1.0')
    .addTag('links')
    .addBearerAuth()
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  const port = configService.get('PORT')

  await app.listen(port)
}
bootstrap()
