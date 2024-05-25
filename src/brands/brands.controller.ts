import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
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

  @Patch('/:id')
  @ApiOperation({ summary: '브랜드 기본 정보 수정 (이미지 제외한 정보 수정)' })
  @ApiResponse({
    status: 200,
    description: '브랜드 기본 정보 수정 (이미지 제외한 정보 수',
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
}
