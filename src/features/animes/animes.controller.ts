import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnimesService } from './animes.service';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { Action } from 'src/casl/casl.types';
import { PoliciesGuard } from 'src/casl/policies-guard';

@UseGuards(PoliciesGuard)
@Controller('animes')
export class AnimesController {
  constructor(private readonly animesService: AnimesService) {}

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'Anime'))
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.animesService.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.Read, 'Anime'))
  findOne(@Param('id') id: string) {
    return this.animesService.findOne({ id: Number(id) });
  }
}
