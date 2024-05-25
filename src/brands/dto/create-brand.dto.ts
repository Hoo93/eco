import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Brand } from '../entities/brand.entity';
import { IsArray, IsPositive, IsString, Max, Min } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateBrandDto {
  @ApiProperty({ description: '브랜드 이름', type: 'string', example: 'Nike' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '브랜드 설명', type: 'string', example: '미국의 대표 스포츠 브랜드' })
  @Optional()
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: '브랜드 로고 이미지 url', type: 'string', example: 'image url' })
  @Optional()
  @IsString()
  logoImageUrl: string;

  @ApiPropertyOptional({ description: '브랜드 설립년도', type: 'number', example: 1971 })
  @Optional()
  @IsPositive()
  @Min(1000)
  @Max(3000)
  establishedYear: number;

  @ApiPropertyOptional({ description: '브랜드 국가', type: 'string', example: 'Unite States of America' })
  @Optional()
  @IsString()
  country: string;

  @ApiPropertyOptional({
    description: '브랜드 이미지 URL (우선순위 순으로)',
    type: 'string',
    isArray: true,
    example: ['image_url_1', 'image_url_2'],
  })
  @Optional()
  @IsString({ each: true })
  @IsArray()
  imageUrls: string[];

  toEntity() {
    const brand = new Brand();
    brand.name = this.name;
    brand.description = this?.description;
    brand.logoImageUrl = this?.logoImageUrl;
    brand.establishedYear = this?.establishedYear;
    brand.country = this?.country;
    return brand;
  }
}
