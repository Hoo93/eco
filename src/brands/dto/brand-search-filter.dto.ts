import { Pagination } from '../../common/response/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class BrandSearchFilterDto extends Pagination {
  @ApiPropertyOptional({ description: '(검색 시작 연도) 브랜드 설립년도 ', type: 'number', example: 1971 })
  @IsPositive()
  @IsOptional()
  establishedYearFrom?: number;

  @ApiPropertyOptional({ description: '(검색 종료 연도) 브랜드 설립년도 ', type: 'number', example: 2000 })
  @IsPositive()
  @IsOptional()
  establishedYearTo?: number;

  @ApiPropertyOptional({ description: '브랜드 국가', type: 'string', example: 'Unite States of America' })
  @IsString()
  @Length(2, 100, { message: '2글자 이상 입력해 주세요.' })
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ description: '브랜드 이름', type: 'string', example: 'Balance' })
  @IsString()
  @Length(2, 100, { message: '2글자 이상 입력해 주세요.' })
  @IsOptional()
  name?: string;
}
