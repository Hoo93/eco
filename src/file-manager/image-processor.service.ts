import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sharp from 'sharp';

// import sharp from 'sharp';

@Injectable()
export class ImageProcessorService {
  constructor() {}

  // sharp 라이브러리 OS 별 설치 방법 달라 발생하는 이슈로 인해 주석처리
  async resize(file: Express.Multer.File, maxLength: number): Promise<Buffer> {
    try {
      // 메타데이터를 읽어서 이미지의 가로세로 길이를 알아냄
      const metadata = await sharp(file.buffer).metadata();
      const width = metadata.width;
      const height = metadata.height;

      // 가로세로 길이가 MAX_LENGTH를 넘어가지 않으면 리사이징 불필요
      if (width < maxLength && height < maxLength) {
        return file.buffer;
      }

      // 가로세로 길이중 더 긴것을 MAX_LENGTH에 맞춰준다
      const resizeOption = width >= height ? { width: maxLength } : { height: maxLength };

      return await sharp(file.buffer)
        .withMetadata()
        .resize({ ...resizeOption, fit: 'contain' })
        .toBuffer();
    } catch (error) {
      throw new InternalServerErrorException('이미지 리사이징에 실패했습니다');
    }
  }
}
