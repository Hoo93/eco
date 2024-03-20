import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import { GetUser } from '../common/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonResponseDto } from '../common/response/command-response.dto';
import { Member } from './entities/member.entity';

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
  @ApiOperation({ summary: '회원 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '회원 상세 조회',
    type: CommonResponseDto<Member>,
  })
  findOneById(@Param('id') id: string): Promise<CommonResponseDto<Member>> {
    return this.membersService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '회원 정보 수정' })
  @ApiResponse({
    status: 200,
    description: '회원 정보 수정',
    type: CommonResponseDto<null>,
  })
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiResponse({
    status: 204,
    description: '회원 탈퇴',
    type: CommonResponseDto<null>,
  })
  softDelete(@Param('id') id: string, @GetUser() memberId: string) {
    return this.membersService.softDelete(id, memberId);
  }
}
