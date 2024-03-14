import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: '리프레시 토큰',
    type: 'string',
    example: 'refreshToken',
  })
  @IsString()
  refreshToken: string;
}
