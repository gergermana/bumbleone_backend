import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { StudiosService } from './studios.service';
import { ZodValidationPipe } from 'src/common/zod-validation.pipe';
import { Action } from 'src/casl/casl.types';

import { AdminModeratorGuard } from 'src/common/guard/admin-moderator-guard';
import { PoliciesGuard } from 'src/casl/policies-guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';

import { createStudioSchema, type CreateStudioDto } from './dto/create-studio.dto';
import { updateStudioSchema, type UpdateStudioDto } from './dto/update-studio.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { getStudiosOrderBy } from './studios-orderby';

@UseGuards(JwtAuthGuard)
@Controller('admin/studios')
export class AdminStudiosController {
    constructor(private readonly studiosService: StudiosService) {}

    @Post()
    @CheckPolicies((ability) => ability.can(Action.Create, 'Studio'))
    create(
        @Body(new ZodValidationPipe(createStudioSchema)) createStudioDto: CreateStudioDto,
    ) {
        return this.studiosService.create(createStudioDto);
    }

    @Get()
    @CheckPolicies((ability) => ability.can(Action.Read, 'Studio'))
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sorting') sorting?: string | "LATEST",
    ) {
        const currentPage = Number(page) || 1;
        const currentLimit = Number(limit) || 20;
        const skip = (currentPage - 1) * currentLimit; 
        const orderBy = getStudiosOrderBy(sorting);
        return this.studiosService.findAll({
            skip,
            take: currentLimit,
            orderBy,
        });
    }

    @Get(':id')
    @CheckPolicies((ability) => ability.can(Action.Read, 'Studio'))
    findOne(@Param('id') id: string) {
        return this.studiosService.findOne(+id);
    }

    @Patch(':id')
    @CheckPolicies((ability) => ability.can(Action.Update, 'Studio'))
    update(
        @Param('id') id: string, 
        @Body(new ZodValidationPipe(updateStudioSchema)) updateStudioDto: UpdateStudioDto,
    ) {
        return this.studiosService.update(+id, updateStudioDto);
    }

    @Delete(':id')
    @CheckPolicies((ability) => ability.can(Action.Delete, 'Studio'))
    remove(@Param('id') id: string) {
        return this.studiosService.remove(+id);
    }
}
