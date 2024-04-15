import { LoginType } from './login-type.enum';

export interface OAuth {
  id: string;
  type: LoginType;
  username: string;
  email: string;
  mobileNumber: string;
}
