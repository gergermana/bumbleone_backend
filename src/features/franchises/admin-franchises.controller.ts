import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FranchisesService } from './franchises.service';
import { createFranchiseSchema, type CreateFranchiseDto } from './dto/create-franchise.dto';
import { updateFranchiseSchema, type UpdateFranchiseDto } from './dto/update-franchise.dto';
import { ZodValidationPipe } from 'src/common/zod-validation.pipe';

@Controller('admin/franchises')
export class FranchisesController {
    constructor(private readonly franchisesService: FranchisesService) {}

    @Post()
    create(
        @Body(new ZodValidationPipe(createFranchiseSchema)) createFranchiseDto: CreateFranchiseDto
    ) {
        return this.franchisesService.create(createFranchiseDto);
    }

    @Get()
    findAll() {
        return this.franchisesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.franchisesService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string, 
        @Body(new ZodValidationPipe(updateFranchiseSchema)) updateFranchiseDto: UpdateFranchiseDto
    ) {
        return this.franchisesService.update(+id, updateFranchiseDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.franchisesService.remove(+id);
    }
}
