import { Module } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { VerificationsController } from './verifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from './entities/verification.entity';
import { PpurioService } from '../sms/ppurio.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Verification]), HttpModule],
  controllers: [VerificationsController],
  providers: [VerificationsService, PpurioService],
})
export class VerificationsModule {}
