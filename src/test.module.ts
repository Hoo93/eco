import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getOrmConfig } from './common/const/orm.config';
import { Member } from './members/entities/member.entity';
import { Manager } from './managers/entities/manager.entity';
import { ManagersModule } from './managers/managers.module';
import { MembersModule } from './members/members.module';
import { MemberLoginHistory } from './auth/member/entity/login-history.entity';
import { VerificationsModule } from './verifications/verifications.module';
import { Verification } from './verifications/entities/verification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.test`,
    }),
    TypeOrmModule.forRoot({
      ...getOrmConfig(),
      entities: [Member, Manager, MemberLoginHistory, Verification],
    }),
    AuthModule,
    ManagersModule,
    MembersModule,
    VerificationsModule,
  ],
})
export class TestModule {}
