import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dto/sign-in.dto';
import { jwtConstants } from '../const/auth.const';
import { JwtPayload } from '../const/jwtPayload.interface';
import { CreateMemberDto } from './dto/create-member.dto';
import { Member } from '../../members/entities/member.entity';
import { UserType } from '../const/user-type.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private jwtService: JwtService,
  ) {}

  public async signup(createMemberDto: CreateMemberDto): Promise<Partial<User>> {
    const user = createMemberDto.toEntity();
    await user.hashPassword();
    const { password, ...result } = await this.memberRepository.save(user);
    return result;
  }

  public async validateUser(username: string, password: string) {
    const user = await this.memberRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new BadRequestException('ID 또는 비밀번호가 정확하지 않습니다.');
  }

  public async signIn(signInDto: SignInDto) {
    const member = await this.validateUser(signInDto.username, signInDto.password);

    const payload: JwtPayload = {
      id: member.id,
      username: member.username,
      userType: UserType.MEMBER,
    };

    const refreshToken = this.generateRefreshToken(payload);

    await this.saveRefreshToken(member.id, refreshToken);

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: refreshToken,
    };
  }

  public async refreshToken(oldRefreshToken: string) {
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
    const newRefreshToken = this.generateRefreshToken(jwtPayload);

    await this.saveRefreshToken(member.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  private generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.accessTokenSecret,
      expiresIn: jwtConstants.accessTokenExpiresIn,
    });
  }

  private generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: jwtConstants.refreshTokenExpiresIn,
    });
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
}
