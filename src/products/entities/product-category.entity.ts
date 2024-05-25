import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '상품_카테고리 PK', type: 'number' })
  id: number;

  @Column({ comment: '상품 번호', type: 'int' })
  @ApiProperty({ description: '상품 번호', type: 'number' })
  productId: number;

  @Column({ comment: '카테고리 번호', type: 'int' })
  @ApiProperty({ description: '카테고리 번호', type: 'number' })
  categoryId: number;

  @ManyToOne(() => Product, (product) => product.productCategories)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Product })
  product: Product;

  @ManyToOne(() => Category, (category) => category.productCategories)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Category })
  category: Category;
}
