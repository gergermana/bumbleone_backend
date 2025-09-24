import { Controller, Post, Get, Patch, Delete, Query, Param, Body, UseGuards } from "@nestjs/common";
import { Action } from "src/casl/casl.types";
import { ZodValidationPipe } from "src/common/zod-validation.pipe";
import { EntriesService } from "./entries.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { EntryStatus, EntryType } from "@prisma/client";
import { getEntriesOrderBy } from "src/features/entries/entries-orderby";

import { AdminModeratorGuard } from "src/common/guard/admin-moderator-guard";
import { PoliciesGuard } from "src/casl/policies-guard";
import { CheckPolicies } from "src/casl/check-policies.decorator";

import { createEntrySchema, type CreateEntryDto } from "./dto/create-entry.dto";
import { updateEntrySchema, type UpdateEntryDto } from "./dto/update-entry.dto";

@UseGuards(JwtAuthGuard, AdminModeratorGuard, PoliciesGuard)
@Controller('admin/entries')
export class AdminEntriesController {
    constructor(private readonly entriesService: EntriesService) {}

    @Post()
    @CheckPolicies((ability) => ability.can(Action.Create, 'Anime'))
    create(
        @Body(new ZodValidationPipe(createEntrySchema)) createEntryDto: CreateEntryDto,
    ) {
        return this.entriesService.create(createEntryDto);
    }

    @Get()
    @CheckPolicies((ability) => ability.can(Action.Read, 'Anime'))
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sorting') sorting?: string | "LATEST",
        @Query('animeType') animeType?: EntryType | "ALL",
        @Query('animeStatus') animeStatus?: EntryStatus | "ALL",
    ) {
        const currentPage = Number(page) || 1;
        const currentLimit = Number(limit) || 20;
        const skip = (currentPage - 1) * currentLimit; 
        const orderBy = getEntriesOrderBy(sorting);
        const typeFilter = animeType && animeType !== "ALL" ? animeType : undefined;
        const statusFilter = animeStatus && animeStatus !== "ALL" ? animeStatus : undefined;

        return this.entriesService.findAllAdmin({
            skip,
            take: currentLimit,
            orderBy,
            where: { 
                type: typeFilter,
                status: statusFilter, 
            },
        });
    }

    @Get(':id')
    @CheckPolicies((ability) => ability.can(Action.Read, 'Anime'))
    findOne(@Param('id') id: string) {
        return this.entriesService.findOne({ id: Number(id) });
    }

    @Patch(':id')
    @CheckPolicies((ability) => ability.can(Action.Update, 'Anime'))
    update(
        @Param('id') id: string, 
        @Body(new ZodValidationPipe(updateEntrySchema)) updateEntryDto: UpdateEntryDto,
    ) {
        return this.entriesService.update(+id, updateEntryDto);
    }

    @Delete(':id')
    @CheckPolicies((ability) => ability.can(Action.Delete, 'Anime'))
    remove(@Param('id') id: string) {
        return this.entriesService.remove(+id);
    }
}