import { UserType } from './user-type.enum';
import { LoginType } from './login-type.enum';
import { MemberType } from './member-type.enum';

export interface JwtPayload {
  id: string;
  username: string;
  userType: UserType;
  loginType?: LoginType;
  memberType?: MemberType;
}
