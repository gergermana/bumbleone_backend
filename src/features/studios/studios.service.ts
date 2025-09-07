import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';
import { Prisma, Studio } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudiosService {
  constructor(private prisma: PrismaService) {}

  create(createStudioDto: CreateStudioDto) {
    return this.prisma.studio.create({
      data: createStudioDto,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.StudioWhereUniqueInput;
    where?: Prisma.StudioWhereInput;
    orderBy?: Prisma.StudioOrderByWithRelationInput;
  }): Promise<{ datalist: Studio[], total: number }> {
    const { skip, take, cursor, where, orderBy } = params;
    return {
      datalist: await this.prisma.studio.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
      total: await this.prisma.studio.count(),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} studio`;
  }

  async update(id: number, updateStudioDto: UpdateStudioDto) {
      try {
        return await this.prisma.studio.update({
          where: { id },
          data: updateStudioDto,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          throw new NotFoundException(`Studio with ID ${id} not found`);
        }
        throw error;
      }
    }

  async remove(id: number) {
      try {
        return await this.prisma.studio.delete({
          where: { id },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          throw new NotFoundException(`Studio with ID ${id} not found`);
        }
        throw error;
      }
    }
}
