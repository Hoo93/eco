import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { BrandImage } from './entities/brand-image.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { JwtPayload } from '../auth/const/jwtPayload.interface';
import { UserType } from '../auth/const/user-type.enum';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(BrandImage)
    private brandImageRepository: Repository<BrandImage>,
  ) {}

  async createBrand(createBrandDto: CreateBrandDto, user: JwtPayload) {
    if (user.userType !== UserType.MANAGER) {
      throw new ForbiddenException('관리자만 브랜드를 생성할 수 있습니다.');
    }

    const brand = createBrandDto.toEntity();
    brand.createId = user.id;
    const createdBrand = await this.brandRepository.save(brand);

    if (createBrandDto.imageUrls) {
      let priority = 1;
      const brandImages = createBrandDto.imageUrls.map((url) => {
        const brandImage = new BrandImage();
        brandImage.createId = user.id;
        brandImage.brandId = createdBrand.id;
        brandImage.imageUrl = url;
        brandImage.priority = priority++;
        return brandImage;
      });

      await this.brandImageRepository.save(brandImages);
    }

    return createdBrand;
  }

  async findAll() {
    return this.brandRepository.find();
  }
}
