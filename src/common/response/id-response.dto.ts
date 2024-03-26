import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IdResponseDto {
  @ApiProperty({ description: 'PK', type: 'string' })
  @IsString()
  id: string;
}
