import { Injectable, NotFoundException } from '@nestjs/common';
import { Entry, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { type CreateEntryDto } from './dto/create-entry.dto';
import { type UpdateEntryDto } from './dto/update-entry.dto';

@Injectable()
export class EntriesService {
constructor(private prisma: PrismaService) {}

    create(createEntryDto: CreateEntryDto) {
        const { genres, studios, ...rest } = createEntryDto;

        return this.prisma.entry.create({
            data: {
                ...rest,
                genres: genres 
                    ? {
                        connect: genres?.map((id) => ({ id })),
                    }
                    : undefined,
                studios: studios 
                    ? {
                        connect: studios?.map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: {
                genres: true,
                studios: true,
            },
        });
    }

    async findAllPublic(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.EntryWhereUniqueInput;
        where?: Prisma.EntryWhereInput;
        orderBy?: Prisma.EntryOrderByWithRelationInput;
    }): Promise<{ datalist: Entry[]; total: number }> {
        const { skip, take, cursor, where, orderBy } = params;
        const initDatalist = await this.prisma.entry.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: { 
                genres: true, 
                studios: true,
            },
        });

        return {
            datalist: initDatalist.map(datalist => ({
                ...datalist,
                genres: datalist.genres.map(g => g.id),
                studios: datalist.studios.map(s => s.id),
            })),
            total: await this.prisma.entry.count({
                cursor,
                where,
                orderBy,
            }),
        }
    }

    async findAllAdmin(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.EntryWhereUniqueInput;
        where?: Prisma.EntryWhereInput;
        orderBy?: Prisma.EntryOrderByWithRelationInput;
    }): Promise<{ datalist: Entry[]; total: number }> {
        const { skip, take, cursor, where, orderBy } = params;
        const initDatalist = await this.prisma.entry.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: { 
                genres: { select: { id: true } }, 
                studios: { select: { id: true } },
            },
        });

        return {
            datalist: initDatalist.map(datalist => ({
                ...datalist,
                genres: datalist.genres.map(g => g.id),
                studios: datalist.studios.map(s => s.id),
            })),
            total: await this.prisma.entry.count({
                cursor,
                where,
                orderBy,
            }),
        }
    }

    async findOne(animeWhereUniqueInput: Prisma.EntryWhereUniqueInput): Promise<Entry | null> {
        return this.prisma.entry.findUnique({
            where: animeWhereUniqueInput,
        });
    }

    update(id: number, updateAnimeDto: UpdateEntryDto) {
        try {
        const { genres, studios, ...rest } = updateAnimeDto;

        return this.prisma.entry.update({
            where: { id },
            data: {
                ...rest,
                genres: genres 
                    ? {
                        set: genres?.map((id) => ({ id })),
                        }
                    : undefined,
                studios: studios 
                    ? {
                        set: studios?.map((id) => ({ id })),
                        }
                    : undefined,
            },
            include: { 
                genres: true,
                studios: true,
            }
        });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Anime with ID ${id} not found`);
            }
            throw error;
        }
    }

    remove(id: number) {
        return `This action removes a #${id} anime`;
    }
}
