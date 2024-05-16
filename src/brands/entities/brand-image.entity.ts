import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/entities/BaseTimeEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Brand } from './brand.entity';

@Entity()
export class BrandImage extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '브랜드 이미지 PK', type: 'number' })
  id: number;

  @ApiProperty({ description: '브랜드 PK', type: 'number' })
  @Column({ comment: '브랜드 PK', type: 'int' })
  brandId: number;

  @ApiProperty({ description: '브랜드 이미지 URL', type: 'string' })
  @Column({ comment: '브랜드 이미지 URL', type: 'text' })
  imageUrl: string;

  @ApiPropertyOptional({ description: '브랜드 이름', type: 'string' })
  @Column({ comment: '브랜드 이름', type: 'varchar', nullable: true })
  name: string;

  @ApiPropertyOptional({ description: '브랜드 설명', type: 'string' })
  @Column({ comment: '브랜드 설명', type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Brand, (brand) => brand.id)
  brand: Brand;
}
