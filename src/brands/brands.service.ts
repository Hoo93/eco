import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { BrandImage } from './entities/brand-image.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(BrandImage)
    private brandImageRepository: Repository<BrandImage>,
  ) {}

  async createBrand(createBrandDto: CreateBrandDto, user: Member) {
    const brand = createBrandDto.toEntity();
    brand.createId = user.id;
    const createdBrand = await this.brandRepository.save(brand);

    if (createBrandDto.imageUrls) {
      const brandImages = createBrandDto.imageUrls.map((url) => {
        const brandImage = new BrandImage();
        brandImage.createId = user.id;
        brandImage.brandId = createdBrand.id;
        brandImage.imageUrl = url;
        return brandImage;
      });

      await this.brandImageRepository.save(brandImages);
    }
  }
}
