import { Body, Controller, Post } from '@nestjs/common';
import { ManagerAuthService } from './manager-auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../dto/sign-in.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Controller('admin/auth')
@ApiTags('[어드민] 인증')
export class ManagerAuthController {
  constructor(private readonly authService: ManagerAuthService) {}

  // @Post('/signup')
  // @ApiOperation({ summary: '어드민 가입' })
  // @ApiResponse({
  //   status: 201,
  //   description: '어드민 가입',
  //   type: User,
  // })
  // @ApiBody({
  //   type: CreateManagerDto,
  //   description: '어드민 가입 DTO',
  // })
  // signup(@Body() createManagerDto: CreateManagerDto) {
  //   return this.authService.signup(createManagerDto);
  // }

  @Post('/signin')
  @ApiOperation({ summary: '어드민 로그인' })
  @ApiResponse({
    status: 200,
    description: '어드민 로그인',
    type: String,
  })
  @ApiBody({
    type: SignInDto,
    description: '로그인 DTO',
  })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('/refresh-token')
  @ApiOperation({ summary: '리프레시 토큰' })
  @ApiResponse({
    status: 200,
    description: '리프레시 토큰',
    type: String,
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: '리프레시토큰 DTO',
  })
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
