import { Password } from '@domain/main/enterprise/entities/value-objects/password'
import { AppModule } from '@infra/app.module'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { DatabaseModule } from '@infra/database/database.module'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AccountFactory } from '@test/factories/make-account'
import { SessionFactory } from '@test/factories/make-session'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtEncrypter: JwtEncrypter
  let accountFactory: AccountFactory
  let sessionFactory: SessionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [JwtEncrypter, AccountFactory, SessionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwtEncrypter = moduleRef.get(JwtEncrypter)
    accountFactory = moduleRef.get(AccountFactory)
    sessionFactory = moduleRef.get(SessionFactory)

    await app.init()
  })

  test('[POST] /sessions/refresh', async () => {
    const account = await accountFactory.makePrismaAccount({
      password: await Password.create('#JohnDoe123'),
    })

    const refreshToken = await jwtEncrypter.encrypt(
      {
        sub: account.id.toString(),
      },
      '7d'
    )

    await sessionFactory.makePrismaSession({
      accountId: account.id,
      refreshToken,
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/refresh')
      .send({ refreshToken })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        session: expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      })
    )

    expect(response.body.session.refreshToken).not.toEqual(refreshToken)
  })
})
