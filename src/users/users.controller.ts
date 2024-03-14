import { Controller, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@ApiTags('회원')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //
  // @Get()
  // @ApiOperation({ summary: '회원 전체 검색' })
  // @ApiResponse({
  //   status: 201,
  //   description: '회원 전체 검색',
  //   type: User,
  // })
  // findAll(pagination: Pagination) {
  //   return this.usersService.findAll(pagination);
  // }
  //
  // @Get('/mobile/:mobileNumber')
  // @ApiOperation({ summary: '휴대전화 번호로 회원 검색' })
  // @ApiResponse({
  //   status: 201,
  //   description: '휴대전화 번호로 회원 검색',
  //   type: User,
  // })
  // @MobileNumberTransform()
  // findOneByMobileNumber(@Param('mobileNumber') mobileNumber: string) {
  //   return this.usersService.findOneByMobileNumber(mobileNumber);
  // }
  //
  // @Get(':id')
  // @ApiOperation({ summary: 'ID로 회원 검색' })
  // @ApiResponse({
  //   status: 201,
  //   description: '회원 검색',
  //   type: User,
  // })
  // findOneId(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // @ApiOperation({ summary: '회원 탈퇴' })
  // @ApiResponse({
  //   status: 201,
  //   description: '회원 탈퇴',
  // })
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
