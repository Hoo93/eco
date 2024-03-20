import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import { GetUser } from '../common/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandResponseDto } from '../common/response/command-response.dto';

@Controller('members')
@UseGuards(AuthGuard('jwt'))
@ApiTags('[클라이언트] 회원')
@ApiBearerAuth('token')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '회원 정보 수정' })
  @ApiResponse({
    status: 200,
    description: '회원 정보 수정',
    type: CommandResponseDto<null>,
  })
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiResponse({
    status: 204,
    description: '회원 탈퇴',
    type: CommandResponseDto<null>,
  })
  softDelete(@Param('id') id: string, @GetUser() memberId: string) {
    return this.membersService.softDelete(id, memberId);
  }
}
