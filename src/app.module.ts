
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { getOrmConfig } from './orm.config';
import { User } from './users/entities/user.entity';
import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";

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
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
