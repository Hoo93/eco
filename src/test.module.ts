import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getOrmConfig } from './orm.config';
import { Member } from './members/entities/member.entity';
import { Manager } from './managers/entities/manager.entity';
import { ManagersModule } from './managers/managers.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.test`,
    }),
    TypeOrmModule.forRoot({
      ...getOrmConfig(),
      entities: [Member, Manager],
    }),
    AuthModule,
    ManagersModule,
    MembersModule,
  ],
})
export class TestModule {}
