import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_ID,
      callbackURL: '/auth/kakao/callback',
    });
  }

  async validate(accessToken, refreshToken, profile, done): Promise<any> {
    console.log(profile);
    console.log(profile._json.kakao_account);
    const { id, username, displayName } = profile;
    const user = {
      kakaoId: id,
      username: username || displayName,
      accessToken,
    };
    done(null, user);
  }
}
