import { Controller, Post, Get, Patch, Delete, Query, Param, Body, UseGuards } from "@nestjs/common";
import { AnimesService } from "src/features/animes/animes.service";
import { Action } from "src/casl/casl.types";
import { ZodValidationPipe } from "src/common/zod-validation.pipe";

import { AdminModeratorGuard } from "src/common/guard/admin-moderator-guard";
import { PoliciesGuard } from "src/casl/policies-guard";
import { CheckPolicies } from "src/casl/check-policies.decorator";

import { createAnimeSchema, type CreateAnimeDto } from "./dto/create-anime.dto";
import { updateAnimeSchema, type UpdateAnimeDto } from "./dto/update-anime.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AnimeStatus, AnimeType } from "@prisma/client";
import { getAnimesOrderBy } from "src/features/animes/animes-orderby";

@UseGuards(JwtAuthGuard)
@Controller('admin/animes')
export class AdminAnimesController {
    constructor(private readonly animesService: AnimesService) {}

    @Post()
    @CheckPolicies((ability) => ability.can(Action.Create, 'Anime'))
    create(
        @Body(new ZodValidationPipe(createAnimeSchema)) createAnimeDto: CreateAnimeDto,
    ) {
        return this.animesService.create(createAnimeDto);
    }

    @Get()
    @CheckPolicies((ability) => ability.can(Action.Read, 'Anime'))
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sorting') sorting?: string | "LATEST",
        @Query('animeType') animeType?: AnimeType | "ALL",
        @Query('animeStatus') animeStatus?: AnimeStatus | "ALL",
    ) {
        const currentPage = Number(page) || 1;
        const currentLimit = Number(limit) || 20;
        const skip = (currentPage - 1) * currentLimit; 
        const orderBy = getAnimesOrderBy(sorting);
        const typeFilter = animeType && animeType !== "ALL" ? animeType : undefined;
        const statusFilter = animeStatus && animeStatus !== "ALL" ? animeStatus : undefined;
        return this.animesService.findAll({
            skip,
            take: currentLimit,
            orderBy,
            where: { 
                animeType: typeFilter,
                animeStatus: statusFilter, 
            },
        });
    }

    @Get(':id')
    @CheckPolicies((ability) => ability.can(Action.Read, 'Anime'))
    findOne(@Param('id') id: string) {
        return this.animesService.findOne({ id: Number(id) });
    }

    @Patch(':id')
    @CheckPolicies((ability) => ability.can(Action.Update, 'Anime'))
    update(
        @Param('id') id: string, 
        @Body(new ZodValidationPipe(updateAnimeSchema)) updateAnimeDto: UpdateAnimeDto,
    ) {
        return this.animesService.update(+id, updateAnimeDto);
    }

    @Delete(':id')
    @CheckPolicies((ability) => ability.can(Action.Delete, 'Anime'))
    remove(@Param('id') id: string) {
        return this.animesService.remove(+id);
    }
}