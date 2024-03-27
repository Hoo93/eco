import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsPositive()
  @ApiProperty({ description: '인증번호 PK', type: 'number' })
  id: number;

  @IsString()
  @ApiProperty({ description: '인증코드', type: 'string' })
  code: string;
}
