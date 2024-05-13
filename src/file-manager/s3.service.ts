import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.initializeS3();
  }

  async uploadFile(path: string, data: Buffer): Promise<string> {
    const bucketName = this.configService.get<string>('BUCKET_NAME', 'your-default-bucket-name');
    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: path,
      Body: data,
      ACL: 'public-read',
    };

    try {
      const result = await this.s3.upload(params).promise();
      console.log(result);
      return result.Location;
    } catch (err) {
      console.error(err); // Logging the error can help in debugging
      throw new InternalServerErrorException('파일 저장에 실패했습니다.');
    }
  }

  private initializeS3(): void {
    const region = 'ap-northeast-2';
    const credentials = {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY', ''),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', ''),
    };

    AWS.config.update({ region, credentials });
    this.s3 = new AWS.S3();
  }
}
