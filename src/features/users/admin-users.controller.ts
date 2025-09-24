import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/features/users/users.service';
import { Action } from 'src/casl/casl.types';

import { PoliciesGuard } from 'src/casl/policies-guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { AdminModeratorGuard } from 'src/common/guard/admin-moderator-guard';
import { ZodValidationPipe } from 'src/common/zod-validation.pipe';

import { createUserSchema, type CreateUserDto } from 'src/features/users/dto/create-user.dto';
import { updateUserSchema, type UpdateUserDto } from 'src/features/users/dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, AdminModeratorGuard, PoliciesGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, 'User'))
  create(
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.usersService.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id: Number(id) });
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.Update, 'User'))
  update(
    @Param('id') id: string, 
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, 'User'))
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
