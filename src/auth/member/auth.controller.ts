import { BadRequestException, Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../common/entities/user.entity';
import { SignInDto } from '../dto/sign-in.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { CurrentIp } from '../../common/decorator/current-ip.decorator';
import { AvailabilityResult } from '../../common/response/is-available-res';
import { CommonResponseDto } from '../../common/response/common-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { OAuth } from '../const/oauth.interface';
import { Request, Response } from 'express';

@Controller('auth')
@ApiTags('[서비스] 인증')
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
    type: CreateMemberDto,
    description: '회원 가입 DTO',
  })
  signup(@Body() createMemberDto: CreateMemberDto) {
    return this.authService.signup(createMemberDto);
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
  async signIn(@Body() signInDto: SignInDto, @CurrentIp() ip: string) {
    return this.authService.signIn(signInDto, ip);
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
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto, @CurrentIp() ip: string) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken, ip);
  }

  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin(@Req() req, @Res() res) {}

  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req: Request, @Res() res: Response, @CurrentIp() ip: string) {
    const kakaoUser: OAuth = {
      username: req.user?.['username'],
      loginType: req.user?.['loginType'],
      name: req.user?.['name'],
      nickname: req.user?.['nickname'],
      email: req.user?.['email'],
      mobileNumber: req.user?.['mobileNumber'],
    };

    const tokenResponse = await this.authService.oauthSignIn(kakaoUser, ip);

    res.cookie('ecoAccessToken', tokenResponse.accessToken);
    res.cookie('ecoRefreshToken', tokenResponse.refreshToken);
    res.redirect('/eco');
  }

  @Get('/check-email')
  @ApiOperation({ summary: '회원 이메일 중복 확인' })
  async checkEmailAvailability(@Query('email') email: string): Promise<CommonResponseDto<AvailabilityResult>> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.isAvailableEmail(email);
  }

  @Get('/check-mobile-number')
  @ApiOperation({ summary: '회원 휴대전화번호 중복 확인' })
  async checkMobileNumberAvailability(@Query('mobileNumber') mobileNumber: string): Promise<CommonResponseDto<AvailabilityResult>> {
    if (!mobileNumber) {
      throw new BadRequestException('Mobile number is required');
    }
    return this.authService.isAvailableMobileNumber(mobileNumber);
  }

  @Get('/check-nickname')
  @ApiOperation({ summary: '회원 아이디 중복 확인' })
  async checkNicknameAvailability(@Query('nickname') nickname: string): Promise<CommonResponseDto<AvailabilityResult>> {
    if (!nickname) {
      throw new BadRequestException('nickname is required');
    }
    return this.authService.isAvailableNickname(nickname);
  }
}
