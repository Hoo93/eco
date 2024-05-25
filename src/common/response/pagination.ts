import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, Max } from 'class-validator';

export abstract class Pagination {
  @ApiProperty({
    type: 'number',
    description: '페이지 번호 / 1번 부터 시작',
    default: 1,
  })
  @IsPositive()
  pageNo: number = 1;

  @ApiProperty({
    type: 'number',
    description: '가지고 올 개수',
    default: 10,
  })
  @IsPositive()
  @Max(100)
  pageSize: number = 10;

  getOffset() {
    return (this.pageNo - 1) * this.pageSize;
  }

  getLimit() {
    return this.pageSize;
  }
}
