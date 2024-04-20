import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({ description: '카테고리 이름', type: 'string' })
  name: string;

  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ description: '부포 카테고리 PK', type: 'number' })
  parentId: number;

  toEntity() {
    const category = new Category();
    category.name = this.name;
    return category;
  }
}
