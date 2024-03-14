import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dto/sign-in.dto';
import { jwtConstants } from '../const/auth.const';
import { JwtPayload } from '../const/jwtPayload.interface';
import { CreateManagerDto } from './dto/create-manager.dto';
import { Manager } from '../../managers/entities/manager.entity';
import { UserType } from '../const/user-type.enum';

@Injectable()
export class ManagerAuthService {
  constructor(
    @InjectRepository(Manager) private managerRepository: Repository<Manager>,
    private jwtService: JwtService,
  ) {}

  public async signup(createManagerDto: CreateManagerDto): Promise<Partial<User>> {
    const user = createManagerDto.toEntity();
    await user.hashPassword();
    const { password, ...result } = await this.managerRepository.save(user);
    return result;
  }

  public async validateUser(username: string, password: string) {
    const user = await this.managerRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new BadRequestException('ID 또는 비밀번호가 정확하지 않습니다.');
  }

  public async signIn(signInDto: SignInDto) {
    const user = await this.validateUser(signInDto.username, signInDto.password);

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      userType: UserType.MANAGER,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  public async refreshToken(oldRefreshToken: string) {
    const decoded: JwtPayload = this.verifyRefreshToken(oldRefreshToken);
    const user = await this.managerRepository.findOneBy({ id: decoded.id });

    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedException();
    }

    const jwtPayload: JwtPayload = {
      id: user.id,
      userType: 'MANAGER',
      username: user.username,
    };

    const newAccessToken = this.generateAccessToken(jwtPayload);
    const newRefreshToken = this.generateRefreshToken(jwtPayload);

    await this.saveRefreshToken(user.id, newRefreshToken);

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
    await this.managerRepository.update(userId, { refreshToken });
  }

  private verifyRefreshToken(oldRefreshToken: string) {
    try {
      return this.jwtService.verify(oldRefreshToken, { secret: jwtConstants.refreshTokenSecret });
    } catch (err) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
  }
}
