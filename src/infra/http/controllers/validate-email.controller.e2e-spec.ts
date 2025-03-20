import { AppModule } from '@infra/app.module'
import { DatabaseModule } from '@infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from '@test/factories/make-user'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Validate Email (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /validate-email', async () => {
    const user = await userFactory.makePrismaUser({
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/validate-email')
      .send({ email: user.email })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
