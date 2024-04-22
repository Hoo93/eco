import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('[TODO] API 명세서')
export class ApiController {
  @Get('/category')
  @ApiOperation({ summary: '최상위 카테고리 조회' })
  async findCategory() {
    throw new Error('Not implemented');
  }

  @Get('/category/:id')
  @ApiOperation({ summary: '카테고리의 하위 카테고리 조회' })
  async findSubCategory(@Param('id') id: string) {
    throw new Error('Not implemented');
  }

  @ApiOperation({ summary: '카테고리의 이동 ( 하위 카테고리 함께 이동 )' })
  async moveCategory(@Param('id') id: string) {
    throw new Error('Not implemented');
  }

  @Patch('/category/:id')
  @ApiOperation({ summary: '카테고리 정보 수정' })
  async updateCategory(@Param('id') id: string) {
    throw new Error('Not implemented');
  }

  @Delete('/category/:id')
  @ApiOperation({ summary: '카테고리 삭제 ( 하위 카테고리 함께 삭제)' })
  async deleteCategory(@Param('id') id: string) {
    throw new Error('Not implemented');
  }
}
