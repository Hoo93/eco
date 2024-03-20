import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { HttpModule } from '@nestjs/axios';
import { PpurioService } from './ppurio.service';

@Module({
  imports: [HttpModule],
  controllers: [SmsController],
  providers: [SmsService, PpurioService],
})
export class SmsModule {}
