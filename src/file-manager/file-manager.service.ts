import { Injectable } from '@nestjs/common';
import { LocalDate, LocalTime } from '@js-joda/core';
import * as path from 'path';
import { ImageProcessorService } from './image-processor.service';
import { JFileEnum } from './const/JFile.enum';
import { IMAGE_MAX_LENGTH } from './const/file.const';
import { S3Service } from './s3.service';

@Injectable()
export class FileManagerService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly imageProcessorService: ImageProcessorService,
  ) {}

  // TODO : 설치환경마다 sharp 설치 방법이 다르므로 설명에 기재할 것
  async saveImgFile(file: Express.Multer.File): Promise<string> {
    const directoryPath = this.createDirectoryPath(file);

    const uniqueFileName = this.createUniqueFileName(file.originalname);
    const filePath = path.join(directoryPath, uniqueFileName);

    // 이미지 리사이징
    // sharp 라이브러리를 사용하여 이미지 리사이징
    const resizedBuffer = await this.imageProcessorService.resize(file, IMAGE_MAX_LENGTH);

    // 파일 저장
    return await this.s3Service.uploadFile(filePath, resizedBuffer);
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const directoryPath = this.createDirectoryPath(file);

    const uniqueFileName = this.createUniqueFileName(file.originalname);
    const filePath = path.join(directoryPath, uniqueFileName);

    // 파일 저장
    const location = await this.s3Service.uploadFile(filePath, file.buffer);
    console.log(decodeURIComponent(location));

    return location;
  }

  private createDirectoryPath(file: Express.Multer.File) {
    console.log(file);
    const fileType = file.mimetype.split('/')[0];
    const fileTypePath = this.fileTypePathFactory(fileType);

    const directoryPath = path.join(fileTypePath, this.getDateFolder());
    return directoryPath;
  }

  private fileTypePathFactory(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'image':
        return JFileEnum.IMAGE.path;
      case 'video':
        return JFileEnum.VIDEO.path;
      default:
        return JFileEnum.ETC.path;
    }
  }

  private getDateFolder() {
    return LocalDate.now().toString().replace(/-/g, '');
  }

  // TODO : 파일명 한글 깨짐 현상 해결 요망
  private createUniqueFileName(fileOriginalName: string) {
    const index = fileOriginalName.lastIndexOf('.');
    const fileName = fileOriginalName.substring(0, index);
    const ext = fileOriginalName.substring(index);

    const now = LocalTime.now();
    const timeStamp = now.hour() + now.minute() + now.second() + now.nano();

    return `${fileName}_${timeStamp}${ext}`;
  }
}
