import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtPayload } from '../auth/const/jwtPayload.interface';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { UserType } from '../auth/const/user-type.enum';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    private readonly dataSource: DataSource,
  ) {}

  async createProduct(createProductDto: CreateProductDto, user: JwtPayload): Promise<CommonResponseDto<Product>> {
    if (user.userType !== UserType.MANAGER) {
      throw new ForbiddenException('관리자만 브랜드를 생성할 수 있습니다.');
    }

    const product = createProductDto.toEntity();

    console.log(product);
    product.createId = user.id;
    const createdBrand = await this.productRepository.save(product);

    let priority = 1;
    const productImages = createProductDto.imageUrls.map((url) => {
      const productImage = new ProductImage();
      productImage.createId = user.id;
      productImage.productId = createdBrand.id;
      productImage.imageUrl = url;
      productImage.priority = priority++;
      return productImage;
    });

    const productCategories = createProductDto.categoryIds.map((categoryId) => {
      const productCategory = new ProductCategory();
      productCategory.productId = createdBrand.id;
      productCategory.categoryId = categoryId;
      return productCategory;
    });

    // Start Transaction
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const manager = queryRunner.manager;

    try {
      await manager.save(ProductImage, productImages);
      await manager.save(ProductCategory, productCategories);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return new CommonResponseDto('SUCCESS CREATE PRODUCT', createdBrand);
  }
}
