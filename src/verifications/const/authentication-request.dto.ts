import { IsString, Matches } from 'class-validator';
import { MobileNumberTransform } from '../../common/decorator/phoneNumber.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationRequestDto {
  @IsString({ message: '휴대전화 번호는 문자열이어야 합니다.' })
  @MobileNumberTransform()
  @Matches(/^01\d{8,9}$/, { message: '유효하지 않은 휴대전화 번호 형식입니다.' })
  @ApiProperty({ description: '휴대전화번호', type: 'string' })
  mobileNumber: string;
}
