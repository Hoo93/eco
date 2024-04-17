import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { OAuth } from '../const/oauth.interface';
import { LoginType } from '../const/login-type.enum';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_ID,
      callbackURL: '/eco/auth/kakao/callback',
    });
  }

  async validate(accessToken, refreshToken, profile, done): Promise<any> {
    const { id, username, displayName, email, mobile_number } = profile;
    const user: OAuth = {
      username: id,
      loginType: LoginType.KAKAO,
      name: username,
      nickname: displayName,
      email,
      mobileNumber: mobile_number,
    };
    done(null, user);
  }
}
