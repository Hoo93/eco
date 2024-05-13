import {
  BadRequestException,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('file')
@ApiTags('[파일업로드]')
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileDtos', maxCount: 10 }, // Adjust 'maxCount' based on your requirements
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '파일 업로드 API [회원만 사용 가능]',
    type: FileUploadDto,
  })
  async uploadFiles(@UploadedFiles() files: { fileDtos: Express.Multer.File[] }) {
    if (!files) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    for (const file of files.fileDtos) {
      if (!file.buffer) {
        throw new BadRequestException('유효하지 않은 파일입니다.');
      }

      const results = await this.fileManagerService.saveFile(file);
    }

    // Process files here - For example, returning the number of files uploaded
    return { message: ` file(s) uploaded successfully.` };
  }
}
