import { ApiProperty } from '@nestjs/swagger';

export class PageResponseDto<T> {
  @ApiProperty({ description: '성공여부', type: 'boolean', example: true })
  success: boolean;
  @ApiProperty({ description: '페이지 크기', type: 'number', example: 10 })
  pageSize: number;
  @ApiProperty({ description: '총 개수', type: 'number', example: 53 })
  count: number;
  @ApiProperty({ description: '전체 페이지 수', type: 'number', example: 6 })
  totalPage: number;
  @ApiProperty({ description: '조회 결과', type: 'object' })
  items: T[];

  constructor(pageSize: number, count: number, items: T[], success = true) {
    this.pageSize = pageSize;
    this.count = count;
    this.totalPage = Math.floor((count + pageSize - 1) / pageSize);
    this.items = items;
    this.success = success;
  }
}
