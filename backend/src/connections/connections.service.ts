import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConnectionDto } from './dto/create-connection.dto';

@Injectable()
export class ConnectionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(projectId?: string) {
    return this.prisma.connection.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: 'asc' },
    });
  }

  create(dto: CreateConnectionDto) {
    return this.prisma.connection.create({ data: dto });
  }

  // deleteMany (rather than delete) makes this idempotent: removing a card
  // cascades its connections in the DB, and the frontend may also fire a
  // separate delete for those same connections — a race that shouldn't error.
  remove(id: string) {
    return this.prisma.connection.deleteMany({ where: { id } });
  }
}
