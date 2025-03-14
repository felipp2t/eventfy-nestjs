import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../../../domain/main/app/repositories/user-repository.js'
import { User } from '../../../../domain/main/enterprise/entities/user.js'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper.js'
import { PrismaService } from '../prisma.service.js'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) return null

    return PrismaUserMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) return null

    return PrismaUserMapper.toDomain(user)
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({ data })
  }
}
