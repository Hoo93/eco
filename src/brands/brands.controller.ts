import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { GetUser } from '../common/decorator/user.decorator';
import { JwtPayload } from '../auth/const/jwtPayload.interface';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { IdResponseDto } from '../common/response/id-response.dto';
import { UpdateBrandImageDto } from './dto/update-brand-image.dto';
import { BrandSearchFilterDto } from './dto/brand-search-filter.dto';
import { PageResponseDto } from '../common/response/pageResponse.dto';

@ApiTags('브랜드')
@Controller('brands')
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  async create(@Body() createBrandDto: CreateBrandDto, @GetUser() user: JwtPayload) {
    return this.brandsService.createBrand(createBrandDto, user);
  }

  @Patch('/:id/image')
  @ApiOperation({ summary: '브랜드 이미지 정보 수정 (기존 이미지 삭제됨)' })
  @ApiResponse({
    status: 200,
    description: '브랜드 이미지 정보 수정 (기존 이미지 삭제됨)',
    type: Brand,
  })
  @ApiBody({
    type: UpdateBrandImageDto,
    description: '브랜드 이미지 수정 DTO',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  async updateImage(
    @Param('id') id: number,
    @Body() updateBrandImageDto: UpdateBrandImageDto,
    @GetUser() user: JwtPayload,
  ): Promise<CommonResponseDto<IdResponseDto>> {
    return this.brandsService.updateBrandImage(id, updateBrandImageDto, user);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '브랜드 기본 정보,로고 이미지 수정 (이미지 제외한 정보 수정)' })
  @ApiResponse({
    status: 200,
    description: '브랜드 기본 정보,로고 이미지 수정 (이미지 제외한 정보 수정)',
    type: Brand,
  })
  @ApiBody({
    type: UpdateBrandDto,
    description: '브랜드 수정 DTO',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  async update(
    @Param('id') id: number,
    @Body() updateBrandDto: UpdateBrandDto,
    @GetUser() user: JwtPayload,
  ): Promise<CommonResponseDto<IdResponseDto>> {
    return this.brandsService.updateBrand(id, updateBrandDto, user);
  }

  @Get()
  @ApiOperation({ summary: '브랜드 전체 조회 (상세 이미지 제외)' })
  @ApiResponse({
    status: 200,
    description: '브랜드 전체 조회 (상세 이미지 제외)',
    type: [Brand],
  })
  async findAll(@Query() brandSearchFilterDto: BrandSearchFilterDto): Promise<PageResponseDto<Brand>> {
    return this.brandsService.findAll(brandSearchFilterDto);
  }
}
