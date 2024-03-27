import { ApiProperty } from "@nestjs/swagger";

export class VerificationCode {
  @ApiProperty({
    description: '6자리 숫자 인증번호',
    type: 'string',
    example: '057638',
  })
  verificationCode: string

  constructor(verificationCode: string) {
    this.verificationCode = verificationCode;
  }
  
}