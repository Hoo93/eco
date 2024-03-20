import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSmsDto {
  @IsString()
  @ApiProperty({
    description: '문자 내용',
    type: 'string',
    example: '불꽃방귀 어피치',
  })
  context: string;

  @IsString()
  @ApiProperty({
    description: '수신번호',
    type: 'string',
    example: '01080981398',
  })
  targetMobileNumber: string;
}
