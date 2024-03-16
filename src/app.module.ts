import { AuthModule } from './auth/auth.module';
import { getOrmConfig } from './orm.config';
import { User } from './users/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from './members/members.module';
import { ManagersModule } from './managers/managers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      ...getOrmConfig(),
      entities: [User],
    }),
    AuthModule,
    MembersModule,
    ManagersModule,
  ],
})
export class AppModule {}
