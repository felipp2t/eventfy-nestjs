import { Password } from '@domain/main/enterprise/entities/value-objects/password'
import { AppModule } from '@infra/app.module'
import { DatabaseModule } from '@infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AccountFactory } from '@test/factories/make-account'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let accountFactory: AccountFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    accountFactory = moduleRef.get(AccountFactory)

    await app.init()
  })

  test('[POST] /accounts/password-recovery/email-verification', async () => {
    await accountFactory.makePrismaAccount({
      email: 'johndoe@example.com',
      password: await Password.create('#JohnDoe123'),
    })

    const response = await request(app.getHttpServer())
      .post('/accounts/password-recovery/email-verification')
      .send({ email: 'johndoe@example.com' })

    expect(response.statusCode).toBe(202)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    )
  })
})
