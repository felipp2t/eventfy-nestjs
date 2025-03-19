import { AppModule } from '@infra/app.module'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'
import { CryptographyModule } from '@infra/cryptography/cryptography.module'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { DatabaseModule } from '@infra/database/database.module'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AccountFactory } from '@test/factories/make-account'
import { SessionFactory } from '@test/factories/make-session'
import { UserFactory } from '@test/factories/make-user'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let authProviderFactory: AccountFactory
  let authTokenFactory: SessionFactory
  let bcryptHasher: BcryptHasher
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [
        UserFactory,
        AccountFactory,
        SessionFactory,
        BcryptHasher,
        JwtEncrypter,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    authProviderFactory = moduleRef.get(AccountFactory)
    authTokenFactory = moduleRef.get(SessionFactory)
    bcryptHasher = moduleRef.get(BcryptHasher)
    jwtEncrypter = moduleRef.get(JwtEncrypter)

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /auth/refresh', async () => {
    const user = await userFactory.makePrismaUser({
      password: await bcryptHasher.hash('123456'),
    })

    const account = await authProviderFactory.makePrismaAccount({
      userId: user.id,
    })

    const refreshToken = await jwtEncrypter.encrypt(
      {
        sub: user.id.toString(),
        accountId: account.id.toString(),
      },
      '7d'
    )

    const session = await authTokenFactory.makePrismaSession({
      userId: user.id,
      accountId: account.id,
      refreshToken,
    })

    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        refreshToken: session.refreshToken,
      })

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
