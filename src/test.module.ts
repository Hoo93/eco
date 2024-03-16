import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { getOrmConfig } from './orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.test`,
    }),
    TypeOrmModule.forRoot({
      ...getOrmConfig(),
      entities: [User],
    }),
    AuthModule,
  ],
})
export class TestModule {}
