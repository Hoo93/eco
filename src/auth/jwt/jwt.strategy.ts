import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../const/auth.const';
import { JwtPayload } from '../const/jwtPayload.interface';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessTokenSecret,
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.id, username: payload.username, userAttendance: payload.userAttendance };
  }
}
