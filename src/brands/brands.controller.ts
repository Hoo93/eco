import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Member } from 'aws-sdk/clients/chime';
import { GetUser } from '../common/decorator/user.decorator';

@ApiTags('카테고리')
@Controller('brands')
@UseGuards(AuthGuard('jwt'))
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiOperation({ summary: '브랜드 생성' })
  @ApiResponse({
    status: 200,
    description: '브랜드 생성',
    type: Brand,
  })
  @ApiBody({
    type: CreateBrandDto,
    description: '브랜드 생성 DTO',
  })
  async create(@Body() createBrandDto: CreateBrandDto, @GetUser() user: Member) {
    return;
  }
}
