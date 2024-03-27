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
import { MembersModule } from '../members/members.module';
import { ManagersModule } from '../managers/managers.module';
import { MemberLoginHistory } from './member/entity/login-history.entity';
import { VerificationsService } from "../verifications/verifications.service";
import { Verification } from "../verifications/entities/verification.entity";

@Module({
  imports: [
    PassportModule,
    MembersModule,
    ManagersModule,
    TypeOrmModule.forFeature([Member, Manager, MemberLoginHistory,Verification]),
    JwtModule.register({}),
  ],
  controllers: [AuthController, ManagerAuthController],
  providers: [AuthService, ManagerAuthService,VerificationsService],
})
export class AuthModule {}
