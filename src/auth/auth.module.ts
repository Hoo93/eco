import { Module } from '@nestjs/common';
import { AuthService } from './member/auth.service';
import { AuthController } from './member/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Member } from '../members/entities/member.entity';
import { Manager } from '../managers/entities/manager.entity';
import { ManagerAuthController } from './manager/manager-auth.controller';
import { ManagerAuthService } from './manager/manager-auth.service';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([Member, Manager]), JwtModule.register({})],
  controllers: [AuthController, ManagerAuthController],
  providers: [AuthService, ManagerAuthService],
})
export class AuthModule {}
