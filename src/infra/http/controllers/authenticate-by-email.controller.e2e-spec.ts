import { Password } from '@domain/main/enterprise/entities/value-objects/password'
import { AppModule } from '@infra/app.module'
import { DatabaseModule } from '@infra/database/database.module'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AccountFactory } from '@test/factories/make-account'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let accountFactory: AccountFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    accountFactory = moduleRef.get(AccountFactory)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await accountFactory.makePrismaAccount({
      email: 'johndoe@example.com',
      password: await Password.create('#Password123'),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '#Password123',
    })

    expect(response.statusCode).toBe(201)

    const accountOnDatabase = await prisma.account.findUnique({
      where: { email: 'johndoe@example.com' },
    })

    expect(accountOnDatabase).toBeTruthy()
  })
})
