import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { MobileNumberTransform } from '../../common/decorator/phoneNumber.decorator';

export class CreateVerificationDto {
  @IsString()
  @ApiProperty({ description: '휴대전화번호', type: 'string' })
  @MobileNumberTransform()
  mobileNumber: string;

  @IsString()
  @ApiProperty({ description: '인증코드', type: 'string' })
  code: string;
}
