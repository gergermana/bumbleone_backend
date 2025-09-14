import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { Prisma, Anime } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnimesService {
  constructor(private prisma: PrismaService) {}

    create(createAnimeDto: CreateAnimeDto) {
        const { genres, studios, ...rest } = createAnimeDto;

        return this.prisma.anime.create({
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

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.AnimeWhereUniqueInput;
        where?: Prisma.AnimeWhereInput;
        orderBy?: Prisma.AnimeOrderByWithRelationInput;
    }): Promise<{ datalist: Anime[]; total: number }> {
        const { skip, take, cursor, where, orderBy } = params;
        const initDatalist = await this.prisma.anime.findMany({
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
            total: await this.prisma.anime.count({
                cursor,
                where,
                orderBy,
            }),
        }
    }

    async findOne(animeWhereUniqueInput: Prisma.AnimeWhereUniqueInput): Promise<Anime | null> {
        return this.prisma.anime.findUnique({
            where: animeWhereUniqueInput,
        });
    }

    update(id: number, updateAnimeDto: UpdateAnimeDto) {
        try {
        const { genres, studios, ...rest } = updateAnimeDto;

        return this.prisma.anime.update({
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
