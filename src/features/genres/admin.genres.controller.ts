import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GenresService } from './genres.service';
import { ZodValidationPipe } from 'src/common/zod-validation.pipe';
import { Action } from 'src/casl/casl.types';

import { AdminModeratorGuard } from 'src/common/guard/admin-moderator-guard';
import { PoliciesGuard } from 'src/casl/policies-guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';

import { createGenreSchema, type CreateGenreDto } from './dto/create-genre.dto';
import { updateGenreSchema, type UpdateGenreDto } from './dto/update-genre.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { getGenresOrderBy } from './genres-orderby';

@UseGuards(JwtAuthGuard)
@Controller('admin/genres')
export class AdminGenresController {
  constructor(private readonly genresService: GenresService) {}

    @Post()
    @CheckPolicies((ability) => ability.can(Action.Create, 'Genre'))
    create(
        @Body(new ZodValidationPipe(createGenreSchema)) createGenreDto: CreateGenreDto,
    ) {
        return this.genresService.create(createGenreDto);
    }

    @Get()
    @CheckPolicies((ability) => ability.can(Action.Read, 'Genre'))
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sorting') sorting?: string | "LATEST",
    ) {
        const currentPage = Number(page) || 1;
        const currentLimit = Number(limit) || 20;
        const skip = (currentPage - 1) * currentLimit; 
        const orderBy = getGenresOrderBy(sorting);
        return this.genresService.findAll({
            skip,
            take: currentLimit,
            orderBy,
        });
    }

    @Get(':id')
    @CheckPolicies((ability) => ability.can(Action.Read, 'Genre'))
    findOne(@Param('id') id: string) {
        return this.genresService.findOne(+id);
    }

    @Patch(':id')
    @CheckPolicies((ability) => ability.can(Action.Update, 'Genre'))
    update(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateGenreSchema)) updateGenreDto: UpdateGenreDto,
    ) {
        return this.genresService.update(+id, updateGenreDto);
    }

    @Delete(':id')
    @CheckPolicies((ability) => ability.can(Action.Delete, 'Genre'))
    remove(@Param('id') id: string) {
        return this.genresService.remove(+id);
    }
}