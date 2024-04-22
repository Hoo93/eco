import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsPositive, IsString, ValidateIf } from 'class-validator';
import { Category } from '../entities/category.entity';
import { MemberGrade } from '../../members/member-grade.enum';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({ description: '카테고리 이름', type: 'string' })
  name: string;

  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ description: '부모 카테고리 PK', type: 'number' })
  parentId: number;

  @IsPositive()
  @ApiPropertyOptional({ description: '동일 부모를 가진 그룹 내의 우선순위', type: 'number' })
  priority: number;

  @IsArray()
  @IsEnum(MemberGrade, { each: true })
  @ValidateIf((o) => o.accessGrades?.length > 0)
  @ApiProperty({
    description: '접근 가능한 회원 등급',
    type: 'enum',
    enum: MemberGrade,
    isArray: true,
  })
  accessGrades: MemberGrade[];

  toEntity() {
    const category = new Category();
    category.name = this.name;
    category.priority = this.priority;
    category.accessGrades = this?.accessGrades;
    return category;
  }
}
