import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: '파일 업로드 DTO',
  })
  fileDtos?: Express.Multer.File[];
}
