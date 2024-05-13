import { Module } from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { FileManagerController } from './file-manager.controller';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [FileManagerController],
  providers: [FileManagerService, S3Service, ConfigService],
})
export class FileManagerModule {}
