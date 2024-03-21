import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { HttpModule } from '@nestjs/axios';
import { PpurioService } from './ppurio.service';

@Module({
  imports: [HttpModule],
  controllers: [SmsController],
  providers: [PpurioService],
})
export class SmsModule {}
