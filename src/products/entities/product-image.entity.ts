import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/entities/BaseTimeEntity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity()
export class ProductImage extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '상품 이미지 PK', type: 'number' })
  id: number;

  @ApiProperty({ description: '상품 PK', type: 'number' })
  @Column({ comment: '상품 PK', type: 'int' })
  productId: number;

  @ApiProperty({ description: '상품 이미지 URL', type: 'string' })
  @Column({ comment: '상품 이미지 URL', type: 'text' })
  imageUrl: string;

  @ApiProperty({ description: '이미지 노출 순서', type: 'number' })
  @Column({ comment: '이미지 노출 순서', type: 'int' })
  priority: number;

  @ManyToOne(() => Product, (product) => product.productImages)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: Product;
}
