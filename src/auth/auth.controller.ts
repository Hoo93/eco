import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
@ApiTags('인증')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({
    status: 201,
    description: '회원 가입',
    type: User,
  })
  @ApiBody({
    type: CreateAuthDto,
    description: '회원 가입 DTO',
  })
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signup(createAuthDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인',
    type: String,
  })
  @ApiBody({
    type: SignInDto,
    description: '로그인 DTO',
  })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post('/regenerate')
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiResponse({
    status: 200,
    description: '토큰 재발급',
    type: String,
  })
  async regenerateAccessToken(@GetUser() user: User) {
    return this.authService.regenerateAccessToken(user);
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
    description: '로그인 DTO',
  })
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
