import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/entities/BaseTimeEntity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity()
export class ProductImage extends BaseTimeEntity {
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

  @ManyToOne(() => Product, (product) => product.productImages)
  product: Product;
}
