import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(projectId?: string) {
    return this.prisma.card.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: 'asc' },
      include: { childProject: { select: { id: true } } },
    });
  }

  async findOne(id: string) {
    const card = await this.prisma.card.findUnique({ where: { id } });
    if (!card) throw new NotFoundException(`Card ${id} não encontrado`);
    return card;
  }

  create(dto: CreateCardDto) {
    const { dueDate, ...rest } = dto;
    return this.prisma.card.create({
      data: { ...rest, dueDate: dueDate ? new Date(dueDate) : undefined },
    });
  }

  async update(id: string, dto: UpdateCardDto) {
    await this.findOne(id);
    const { dueDate, ...rest } = dto;
    return this.prisma.card.update({
      where: { id },
      data: { ...rest, dueDate: dueDate ? new Date(dueDate) : undefined },
    });
  }

  // deleteMany (rather than delete) makes this idempotent: a rapid
  // undo/redo or a delete racing with another request shouldn't error just
  // because the card is already gone by the time this runs.
  remove(id: string) {
    return this.prisma.card.deleteMany({ where: { id } });
  }
}
