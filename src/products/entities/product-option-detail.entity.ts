import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/entities/BaseTimeEntity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductOption } from './product-option.entity';

@Entity()
export class ProductOptionDetail extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '상품 옵션 디테일 PK', type: 'number' })
  id: number;

  @ApiProperty({ description: '상품 옵션 PK', type: 'number' })
  @Column({ comment: '상품 옵션 PK', type: 'int' })
  productOptionId: number;

  @ApiProperty({ description: '상품 옵션 디테일 이름', type: 'string' })
  @Column({ comment: '상품 옵션 디테일 이름', type: 'text' })
  title: string;

  @ApiProperty({ description: '추가 금액', type: 'number' })
  @Column({ comment: '추가 금액', type: 'int' })
  additionalPrice: number;

  @ApiProperty({ description: '옵션 디테일 노출 순서', type: 'number' })
  @Column({ comment: '옵션 디테일 노출 순서', type: 'int' })
  priority: number;

  @ManyToOne(() => ProductOption, (productOption) => productOption.details)
  @JoinColumn({ name: 'productOptionId', referencedColumnName: 'id' })
  productOption: ProductOption;
}
