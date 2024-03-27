import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommonResponseDto<T> {
  @ApiProperty({ description: '성공여부', type: 'boolean', example: true })
  success: boolean;
  @ApiProperty({ description: '요청 성공 메시지', type: 'string', example: '요청 성공 메시지' })
  message: string;
  @ApiPropertyOptional({ description: '데이터', type: 'object', example: {} })
  data?: T;

  constructor(message: string, data?: T, success: boolean = true) {
    this.success = success;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
  }
}
