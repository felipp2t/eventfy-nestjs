import { faker } from '@faker-js/faker'
import { AppModule } from '@infra/app.module'
import { DatabaseModule } from '@infra/database/database.module'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AuthProviderFactory } from '@test/factories/make-auth-provider'
import { AuthTokenFactory } from '@test/factories/make-auth-token'
import { UserFactory } from '@test/factories/make-user'
import { hash } from 'bcryptjs'
import { AUTH_METHOD } from 'src/core/constants/auth-provider'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let authProviderFactory: AuthProviderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        AuthProviderFactory,
        AuthTokenFactory,
        PrismaService,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    authProviderFactory = moduleRef.get(AuthProviderFactory)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    })

    await authProviderFactory.makeAuthProvider({
      userId: user.id,
      name: faker.person.fullName(),
      provider: AUTH_METHOD.EMAIL,
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      token: expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    })
  }, 60000)
})
