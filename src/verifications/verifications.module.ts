import { Module } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { VerificationsController } from './verifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from './entities/verification.entity';
import { PpurioService } from '../sms/ppurio.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [TypeOrmModule.forFeature([Verification]), HttpModule,ConfigModule],
  controllers: [VerificationsController],
  providers: [VerificationsService, PpurioService],
})
export class VerificationsModule {}
