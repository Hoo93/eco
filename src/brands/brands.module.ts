import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { BrandImage } from './entities/brand-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, BrandImage])],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
