import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dto/sign-in.dto';
import { jwtConstants } from '../const/auth.const';
import { JwtPayload } from '../const/jwtPayload.interface';
import { CreateMemberDto } from './dto/create-member.dto';
import { Member } from '../../members/entities/member.entity';
import { UserType } from '../const/user-type.enum';
import { CommonResponseDto } from '../../common/response/common-response.dto';
import { MemberLoginHistory } from './entity/login-history.entity';
import { TokenResponseDto } from '../dto/token-response.dto';
import { AvailabilityResult } from '../../common/response/is-available-res';
import { VerificationsService } from "../../verifications/verifications.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(MemberLoginHistory) private memberLoginHistoryRepository: Repository<MemberLoginHistory>,
    private jwtService: JwtService,
    private verficationService: VerificationsService
  ) {}

  public async signup(createMemberDto: CreateMemberDto): Promise<CommonResponseDto<Member>> {
    const member = createMemberDto.toEntity();
    await member.hashPassword();
    const createdMember = await this.memberRepository.save(member);

    delete createdMember.password;

    return new CommonResponseDto('SUCCESS SIGNUP', createdMember);
  }

  public async signIn(signInDto: SignInDto, ip: string, loginAt: Date = new Date()): Promise<CommonResponseDto<TokenResponseDto>> {
    const member = await this.validateMember(signInDto.username, signInDto.password);

    const payload: JwtPayload = {
      id: member.id,
      username: member.username,
      userType: UserType.MEMBER,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload, signInDto.isAutoLogin);

    await this.saveRefreshToken(member.id, refreshToken);

    await this.createLoginHistory(member.id, ip, loginAt);

    await this.memberRepository.update(member.id, { isAutoLogin: signInDto.isAutoLogin ?? false });

    return new CommonResponseDto('SUCCESS SIGNIN', new TokenResponseDto(accessToken, refreshToken));
  }

  public async refreshToken(oldRefreshToken: string, ip: string): Promise<CommonResponseDto<TokenResponseDto>> {
    const decoded: JwtPayload = this.verifyRefreshToken(oldRefreshToken);
    // const member = await this.memberRepository.findOneBy({ id: decoded.id });

    const recentLoginHistory = await this.memberLoginHistoryRepository.findOne({
      relations: { member: true },
      where: { memberId: decoded.id },
      order: { loginAt: 'DESC' },
    });

    if (!recentLoginHistory?.member || recentLoginHistory?.member.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedException('리프레시토큰이 유효하지 않습니다.');
    }

    if (!recentLoginHistory || recentLoginHistory.currentIp !== ip) {
      throw new UnauthorizedException('마지막으로 로그인 한 기기가 아닙니다.');
    }

    const jwtPayload: JwtPayload = {
      id: recentLoginHistory.member.id,
      username: recentLoginHistory.member.username,
      userType: UserType.MEMBER,
    };

    const newAccessToken = this.generateAccessToken(jwtPayload);
    const newRefreshToken = this.generateRefreshToken(jwtPayload, recentLoginHistory.member.isAutoLogin);

    await this.saveRefreshToken(recentLoginHistory.member.id, newRefreshToken);

    return new CommonResponseDto('SUCCESS REFRESH TOKEN', new TokenResponseDto(newAccessToken, newRefreshToken));
  }

  public async isAvailableEmail(email: string): Promise<CommonResponseDto<AvailabilityResult>> {
    const found = await this.memberRepository.findOneBy({ email });

    return new CommonResponseDto('Email Valid check success', new AvailabilityResult(!!!found));
  }

  public async isAvailableMobileNumber(mobileNumber: string): Promise<CommonResponseDto<AvailabilityResult>> {
    const found = await this.memberRepository.findOneBy({ mobileNumber });
    return new CommonResponseDto('MobileNumber Valid check success', new AvailabilityResult(!!!found));
  }

  public async isAvailableNickname(nickname: string): Promise<CommonResponseDto<AvailabilityResult>> {
    const found = await this.memberRepository.findOneBy({ nickname });
    return new CommonResponseDto('Nickname Valid check success', new AvailabilityResult(!!!found));
  }

  private generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: jwtConstants.accessTokenExpiresIn,
    });
  }

  private generateRefreshToken(payload: JwtPayload, isAutoLogin: boolean = false) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: isAutoLogin ? jwtConstants.autoLoginRefreshTokenExpiresIn : jwtConstants.refreshTokenExpiresIn,
    });
  }

  private async validateMember(username: string, password: string) {
    const member = await this.memberRepository.findOne({ where: { username } });
    if (member && (await bcrypt.compare(password, member.password))) {
      return member;
    }
    throw new BadRequestException('ID 또는 비밀번호가 정확하지 않습니다.');
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    await this.memberRepository.update(userId, { refreshToken });
  }

  private verifyRefreshToken(oldRefreshToken: string) {
    try {
      return this.jwtService.verify(oldRefreshToken, { secret: jwtConstants.refreshTokenSecret });
    } catch (err) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
  }

  private async createLoginHistory(memberId: string, ip: string, loginAt: Date): Promise<null> {
    const loginHistory = new MemberLoginHistory();
    loginHistory.memberId = memberId;
    loginHistory.currentIp = ip;
    loginHistory.loginAt = loginAt;

    await this.memberLoginHistoryRepository.insert(loginHistory);
    return;
  }
}
