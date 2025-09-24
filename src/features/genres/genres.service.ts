import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Prisma, Genre } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenresService {
    constructor(private prisma: PrismaService) {}
    
    create(createGenreDto: CreateGenreDto) {
        return this.prisma.genre.create({
            data: createGenreDto,
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.GenreWhereUniqueInput;
        where?: Prisma.GenreWhereInput;
        orderBy?: Prisma.GenreOrderByWithRelationInput;
    }): Promise<{ datalist: Genre[], total: number }> {
        const { skip, take, cursor, where, orderBy } = params;
        return {
            datalist: await this.prisma.genre.findMany({
                skip,
                take,
                cursor,
                where,
                orderBy,
            }),
            total: await this.prisma.genre.count(),
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} genre`;
    }

    async update(id: number, updateGenreDto: UpdateGenreDto) {
        try {
            return await this.prisma.genre.update({
                where: { id },
                data: updateGenreDto,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Genre with ID ${id} not found`);
            }
            throw error;
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.genre.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Genre with ID ${id} not found`);
            }
            throw error;
        }
    }
}
