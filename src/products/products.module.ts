import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductCategory } from './entities/product-category.entity';
import { ProductOptionDetail } from './entities/product-option-detail.entity';
import { ProductOption } from './entities/product-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, ProductCategory, ProductOptionDetail, ProductOption])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
