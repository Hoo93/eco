import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/entities/BaseTimeEntity';
import { ApiProperty } from '@nestjs/swagger';
import { Brand } from '../../brands/entities/brand.entity';
import { ProductImage } from './product-image.entity';
import { ProductCategory } from './product-category.entity';

@Entity()
export class Product extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '상품 PK', type: 'number' })
  id: number;

  @ApiProperty({ description: '상품 이름', type: 'string' })
  @Column({ comment: '상품 이름', type: 'varchar' })
  title: string;

  @ApiProperty({ description: '상품 설명 (HTML)', type: 'string' })
  @Column({ comment: '상품 설명 (HTML)', type: 'text' })
  description: string;

  @ApiProperty({ description: '상품 요약 설명 (50글자 이하)', type: 'string' })
  @Column({ comment: '상품 요약 설명 (50글자 이하)', type: 'text' })
  summary: string;

  @ApiProperty({ description: '상품 가격', type: 'number' })
  @Column({ comment: '상품 가격', type: 'int' })
  price: number;

  @ApiProperty({ description: '상품 재고', type: 'number' })
  @Column({ comment: '상품 재고', type: 'int', default: 0 })
  stock: number;

  @ApiProperty({ description: '상품 대표 이미지 URL', type: 'string' })
  @Column({ comment: '상품 대표 이미지 URL', type: 'text' })
  mainImageUrl: string;

  @ApiProperty({ description: '상품 브랜드 ID', type: 'number' })
  @Column({ comment: '상품 브랜드 ID', type: 'int' })
  brandId: number;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  productImages: ProductImage[];

  @OneToMany(() => ProductCategory, (productCategory) => productCategory.product)
  productCategories: ProductCategory[];
}
