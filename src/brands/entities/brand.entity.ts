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

  @ApiProperty({ description: '브랜드 이름', type: 'string' })
  @Column({ comment: '브랜드 이름', type: 'varchar' })
  name: string;

  @ApiPropertyOptional({ description: '브랜드 설명', type: 'string' })
  @Column({ comment: '브랜드 설명', type: 'text', nullable: true })
  description: string;

  @ApiPropertyOptional({ description: '브랜드 로고 이미지 url', type: 'string' })
  @Column({ comment: '브랜드 로고 이미지 url', type: 'text', nullable: true })
  logoImageUrl: string;

  @ApiPropertyOptional({ description: '브랜드 설립년도', type: 'number' })
  @Column({ comment: '브랜드 설립년도', type: 'int', nullable: true })
  establishedYear: number;

  @ApiPropertyOptional({ description: '브랜드 국가', type: 'string' })
  @Column({ comment: '브랜드 국가', type: 'varchar', nullable: true })
  country: string;

  @OneToMany(() => BrandImage, (brandImage) => brandImage.brand)
  brandImages: BrandImage[];

  @OneToMany(() => BrandImage, (brandImage) => brandImage.brand)
  products: Product[];
}
