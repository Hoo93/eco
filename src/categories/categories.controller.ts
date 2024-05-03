import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('카테고리')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: '카테고리 생성' })
  @ApiResponse({
    status: 200,
    description: '카테고리 생성',
    type: Category,
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: '카테고리 생성 DTO',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: '최상위 카테고리 조회' })
  @ApiResponse({
    status: 200,
    description: '최상위 카테고리 조회',
    type: [Category],
  })
  async findAll() {
    return;
  }
}
