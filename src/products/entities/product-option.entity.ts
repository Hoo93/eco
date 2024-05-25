import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/entities/BaseTimeEntity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';
import { ProductOptionDetail } from './product-option-detail.entity';

@Entity()
export class ProductOption extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '상품 옵션 PK', type: 'number' })
  id: number;

  @ApiProperty({ description: '상품 PK', type: 'number' })
  @Column({ comment: '상품 PK', type: 'int' })
  productId: number;

  @ApiProperty({ description: '필수 여부', type: 'boolean' })
  @Column({ comment: '필수 여부', type: 'boolean' })
  isRequired: boolean;

  @ApiProperty({ description: '옵션 노출 순서', type: 'number' })
  @Column({ comment: '옵션 노출 순서', type: 'int' })
  priority: number;

  @ManyToOne(() => Product, (product) => product.productImages)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: Product;

  @OneToMany(() => ProductOptionDetail, (productOptionDetail) => productOptionDetail.productOption)
  details: ProductOptionDetail[];
}
