import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getOrmConfig = () => {
  const configService = new ConfigService();

  const ormConfig = {
    type: configService.get('DB_TYPE'),
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
    logging: configService.get('DB_LOGGING') === 'true',
    poolSize: +configService.get('DB_POOL_SIZE'),
    charset: configService.get('DB_CHARSET'),
    autoLoadEntities: true,
  };

  return ormConfig;
};
