import { AppModule } from '@infra/app.module'
import { GoogleAuthGuard } from '@infra/auth/providers/google/google-auth.guard'
import { DatabaseModule } from '@infra/database/database.module'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { ExecutionContext, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Authenticate Account By Google (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService],
    })
      .overrideGuard(GoogleAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest()
          req.user = {
            sub: '123456',
            email: 'johndoe@gmail.com',
            name: 'John Doe',
          }
          return true
        },
      })
      .compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[GET] /accounts/google/callback', async () => {
    const response = await request(app.getHttpServer()).get(
      '/accounts/google/callback'
    )

    const createdAccount = await prisma.account.findUnique({
      where: { email: 'johndoe@gmail.com' },
    })

    expect(createdAccount).not.toBeNull()
    expect(createdAccount?.email).toBe('johndoe@gmail.com')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        session: expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      })
    )
  })
})
