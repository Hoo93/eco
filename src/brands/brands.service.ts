import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { BrandImage } from './entities/brand-image.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { JwtPayload } from '../auth/const/jwtPayload.interface';
import { UserType } from '../auth/const/user-type.enum';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { IdResponseDto } from '../common/response/id-response.dto';
import { UpdateBrandImageDto } from './dto/update-brand-image.dto';

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

    if (createBrandDto.imageUrls.length > 0) {
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

  async updateBrand(id: number, updateBrandDto: UpdateBrandDto, user: JwtPayload): Promise<CommonResponseDto<IdResponseDto>> {
    if (user.userType !== UserType.MANAGER) {
      throw new ForbiddenException('관리자만 브랜드를 수정할 수 있습니다.');
    }

    updateBrandDto.updateId = user.id;

    await this.brandRepository.update(id, updateBrandDto);
    return new CommonResponseDto('SUCCESS UPDATE BRAND', new IdResponseDto(id));
  }

  async findAll() {
    return this.brandRepository.find();
  }

  async updateBrandImage(
    id: number,
    updateBrandImageDto: UpdateBrandImageDto,
    user: JwtPayload,
  ): Promise<CommonResponseDto<IdResponseDto>> {
    if (user.userType !== UserType.MANAGER) {
      throw new ForbiddenException('관리자만 브랜드를 수정할 수 있습니다.');
    }

    updateBrandImageDto.updateId = user.id;

    // 기존 이미지 삭제
    await this.brandImageRepository.delete({ brandId: id });

    if (updateBrandImageDto.imageUrls.length > 0) {
      let priority = 1;
      const brandImages = updateBrandImageDto.imageUrls.map((url) => {
        const brandImage = new BrandImage();
        brandImage.createId = user.id;
        brandImage.brandId = id;
        brandImage.imageUrl = url;
        brandImage.priority = priority++;
        return brandImage;
      });

      await this.brandImageRepository.save(brandImages);
    }

    return new CommonResponseDto('SUCCESS UPDATE BRAND', new IdResponseDto(id));
  }
}
