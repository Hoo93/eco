import { LoginType } from './login-type.enum';

export interface OAuth {
  username: string;
  loginType: LoginType;
  name: string;
  nickname: string;
  email: string;
  mobileNumber: string;
}
