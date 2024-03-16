import { AuthModule } from './auth/auth.module';
import { getOrmConfig } from './common/const/orm.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from './members/members.module';
import { ManagersModule } from './managers/managers.module';
import { Member } from './members/entities/member.entity';
import { Manager } from './managers/entities/manager.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      ...getOrmConfig(),
      entities: [Member, Manager],
    }),
    AuthModule,
    MembersModule,
    ManagersModule,
  ],
})
export class AppModule {}
