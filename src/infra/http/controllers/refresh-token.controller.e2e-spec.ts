import { AppModule } from '@infra/app.module'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'
import { CryptographyModule } from '@infra/cryptography/cryptography.module'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { DatabaseModule } from '@infra/database/database.module'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthProviderFactory } from '@test/factories/make-auth-provider'
import { AuthTokenFactory } from '@test/factories/make-auth-token'
import { UserFactory } from '@test/factories/make-user'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let authProviderFactory: AuthProviderFactory
  let authTokenFactory: AuthTokenFactory
  let bcryptHasher: BcryptHasher
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [
        UserFactory,
        AuthProviderFactory,
        AuthTokenFactory,
        BcryptHasher,
        JwtEncrypter,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    authProviderFactory = moduleRef.get(AuthProviderFactory)
    authTokenFactory = moduleRef.get(AuthTokenFactory)
    bcryptHasher = moduleRef.get(BcryptHasher)
    jwtEncrypter = moduleRef.get(JwtEncrypter)

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /auth/refresh', async () => {
    const user = await userFactory.makePrismaUser({
      password: await bcryptHasher.hash('123456'),
    })

    const authProvider = await authProviderFactory.makePrismaAuthProvider({
      userId: user.id,
    })

    const refreshToken = await jwtEncrypter.encrypt({
      sub: user.id.toString(),
      providerId: authProvider.id.toString(),
    })

    const authToken = await authTokenFactory.makePrismaAuthToken({
      userId: user.id,
      providerId: authProvider.id,
      refreshToken,
    })

    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        refreshToken: authToken.refreshToken,
      })

    console.log(response.body)

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      })
    )
  })
})
