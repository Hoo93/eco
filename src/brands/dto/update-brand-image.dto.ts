import { PickType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandImageDto extends PickType(CreateBrandDto, ['imageUrls']) {
  updateId: string;
}
