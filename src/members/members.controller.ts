import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from '../auth/member/dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { GetUser } from '../common/decorator/user.decorator';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string, @GetUser() memberId: string) {
    return this.membersService.softDelete(id, memberId);
  }
}
