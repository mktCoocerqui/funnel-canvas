import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filter: { workspaceId?: string; parentCardId?: string }) {
    return this.prisma.project.findMany({
      where: {
        ...(filter.workspaceId ? { workspaceId: filter.workspaceId } : {}),
        // Filtering by workspace alone means "give me its top-level projects"
        // (a card's dedicated page is only ever reached explicitly via its
        // own parentCardId, not lumped in with the workspace's project list).
        parentCardId: filter.parentCardId ?? null,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Projeto ${id} não encontrado`);
    return project;
  }

  create(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto });
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.project.delete({ where: { id } });
  }
}
