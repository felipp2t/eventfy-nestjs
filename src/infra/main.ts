import { AppModule } from '@infra/app.module'
import { NestFactory } from '@nestjs/core'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error'],
  })

  app.setGlobalPrefix('api')

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port)
}
bootstrap()
