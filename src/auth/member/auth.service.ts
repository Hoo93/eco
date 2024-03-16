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
import { CommandResponseDto } from '../../common/response/command-response.dto';
import { MemberLoginHistory } from './entity/login-history.entity';
import { TokenResponseDto } from '../const/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(MemberLoginHistory) private memberLoginHistoryRepository: Repository<MemberLoginHistory>,
    private jwtService: JwtService,
  ) {}

  public async signup(createMemberDto: CreateMemberDto): Promise<CommandResponseDto<Member>> {
    const member = createMemberDto.toEntity();
    await member.hashPassword();
    const createdMember = await this.memberRepository.save(member);

    delete createdMember.password;

    return new CommandResponseDto('SUCCESS SIGNUP', createdMember);
  }

  public async signIn(signInDto: SignInDto, ip: string, loginAt: Date = new Date()): Promise<CommandResponseDto<TokenResponseDto>> {
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

    return new CommandResponseDto('SUCCESS SIGNIN', new TokenResponseDto(accessToken, refreshToken));
  }

  public async refreshToken(oldRefreshToken: string, ip: string): Promise<CommandResponseDto<TokenResponseDto>> {
    const decoded: JwtPayload = this.verifyRefreshToken(oldRefreshToken);
    const member = await this.memberRepository.findOneBy({ id: decoded.id });

    if (!member || member.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedException();
    }

    const jwtPayload: JwtPayload = {
      id: member.id,
      username: member.username,
      userType: UserType.MEMBER,
    };

    const newAccessToken = this.generateAccessToken(jwtPayload);
    const newRefreshToken = this.generateRefreshToken(jwtPayload, member.isAutoLogin);

    await this.saveRefreshToken(member.id, newRefreshToken);

    return new CommandResponseDto('SUCCESS REFRESH TOKEN', new TokenResponseDto(newAccessToken, newRefreshToken));
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
