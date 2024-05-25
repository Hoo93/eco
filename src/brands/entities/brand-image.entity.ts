import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/entities/BaseTimeEntity';
import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({ description: '이미지 노출 순서', type: 'number' })
  @Column({ comment: '이미지 노출 순서', type: 'int' })
  priority: number;

  @ManyToOne(() => Brand, (brand) => brand.brandImages)
  brand: Brand;
}
