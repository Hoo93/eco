import * as process from 'node:process';

export const SALT = 13;
export const jwtConstants = {
  accessTokenSecret: 'This is my super secret',
  refreshTokenSecret: 'This is my super super secret',
  accessTokenExpiresIn: process.env.NODE_ENV === 'production' ? '300s' : '1d',
  refreshTokenExpiresIn: '1d',
  autoLoginRefreshTokenExpiresIn: '30d',
};
