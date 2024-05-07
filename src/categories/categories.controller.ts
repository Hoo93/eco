import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
    // return this.categoriesService.create(createCategoryDto);
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '카테고리 수정' })
  async update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return;
  }

  @Get()
  @ApiOperation({ summary: '전체 카테고리 조회' })
  @ApiResponse({
    status: 200,
    description: '전체 카테고리 조회',
    type: [Category],
  })
  async findAll() {
    return this.categoriesService.findAll();
  }
}
