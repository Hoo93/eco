import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/entities/BaseTimeEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BrandImage } from './brand-image.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Brand extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '브랜드 PK', type: 'number' })
  id: number;

  @ApiPropertyOptional({ description: '브랜드 이름', type: 'string' })
  @Column({ comment: '브랜드 이름', type: 'varchar', nullable: true })
  name: string;

  @ApiPropertyOptional({ description: '브랜드 설명', type: 'string' })
  @Column({ comment: '브랜드 설명', type: 'text', nullable: true })
  description: string;

  @OneToMany(() => BrandImage, (brandImage) => brandImage.brand)
  brandImages: BrandImage[];

  @OneToMany(() => BrandImage, (brandImage) => brandImage.brand)
  products: Product[];
}
