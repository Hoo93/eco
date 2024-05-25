import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { GetUser } from '../common/decorator/user.decorator';
import { JwtPayload } from '../auth/const/jwtPayload.interface';

@Controller('products')
@ApiTags('상품')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: '상품 생성 (상품 옵션 생성은 별도 API 이용)' })
  @ApiResponse({
    status: 200,
    description: '상품 생성 (상품 옵션 생성은 별도 API 이용)',
    type: Product,
  })
  @ApiBody({
    type: CreateProductDto,
    description: '상품 생성 DTO',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  async createProduct(@Body() createProductDto: CreateProductDto, @GetUser() user: JwtPayload) {
    return this.productsService.createProduct(createProductDto, user);
  }
}
