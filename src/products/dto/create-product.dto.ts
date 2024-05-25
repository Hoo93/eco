import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsPositive, IsString } from 'class-validator';
import { Product } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ description: '상품 이름', type: 'string' })
  @IsString()
  title: string;

  @ApiProperty({ description: '상품 설명 (HTML)', type: 'string' })
  @IsString()
  description: string;

  @ApiProperty({ description: '상품 요약 설명 (50글자 이하)', type: 'string' })
  @IsString()
  summary: string;

  @ApiProperty({ description: '상품 가격', type: 'number' })
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ description: '상품 재고 (미입력시 재고 0)', type: 'number' })
  @IsOptional()
  @IsPositive()
  stock: number;

  @ApiProperty({ description: '상품 대표 이미지 URL', type: 'string' })
  @IsString()
  mainImageUrl: string;

  @ApiProperty({ description: '상품 브랜드 ID', type: 'number' })
  @IsPositive()
  brandId: number;

  @ApiProperty({ description: '상품 카테고리 ID 배열', type: 'number', isArray: true })
  @IsArray()
  @IsPositive({ each: true })
  categoryIds: number[];

  @ApiProperty({ description: '상품 이미지 URL 배열 (우선순위 순으로)', type: 'string', isArray: true })
  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  toEntity() {
    const product = new Product();
    product.title = this.title;
    product.description = this.description;
    product.summary = this.summary;
    product.price = this.price;
    product.stock = this.stock || 0;
    product.mainImageUrl = this.mainImageUrl;
    product.brandId = this.brandId;
    return product;
  }
}
