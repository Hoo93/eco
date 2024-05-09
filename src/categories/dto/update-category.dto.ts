import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, IsPositive } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsPositive()
  @IsOptional()
  @ApiProperty({ description: '카테고리 우선순위', type: 'number' })
  priority: number;
}
