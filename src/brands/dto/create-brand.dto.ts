import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Brand } from '../entities/brand.entity';
import { IsPositive, IsString, Max, Min } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateBrandDto {
  @ApiProperty({ description: '브랜드 이름', type: 'string' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '브랜드 설명', type: 'string' })
  @Optional()
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: '브랜드 로고 이미지 url', type: 'string' })
  @Optional()
  @IsString()
  logoImageUrl: string;

  @ApiPropertyOptional({ description: '브랜드 설립년도', type: 'number' })
  @Optional()
  @IsPositive()
  @Min(1000)
  @Max(3000)
  establishedYear: number;

  @ApiPropertyOptional({ description: '브랜드 국가', type: 'string' })
  @Optional()
  @IsString()
  country: string;

  @ApiPropertyOptional({ description: '브랜드 이미지 URL (우선순위 순으로)', type: 'string', isArray: true })
  imageUrls: string[];

  toEntity() {
    const brand = new Brand();
    brand.name = this.name;
    brand.description = this?.description;
    brand.logoImageUrl = this?.logoImageUrl;
    return brand;
  }
}
