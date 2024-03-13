import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export abstract class Pagination {
  @ApiProperty({
    type: 'number',
    description: '스킵할 개수',
    default: 0,
  })
  @IsNumber()
  @Min(0)
  pageNo: number = 0;

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
