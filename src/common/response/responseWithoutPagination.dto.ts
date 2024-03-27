import { ApiProperty } from '@nestjs/swagger';

export class ResponseWithoutPaginationDto<T> {
  @ApiProperty({ description: '성공여부', type: 'boolean', example: true })
  success: boolean;
  @ApiProperty({ description: '총 개수', type: 'number', example: 53 })
  count: number;
  @ApiProperty({ description: '조회 결과', type: 'object' })
  items: T[];

  constructor(count: number, items: T[], success = true) {
    this.count = count;
    this.items = items;
    this.success = success;
  }
}
