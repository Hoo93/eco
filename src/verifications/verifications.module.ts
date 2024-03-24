import { Module } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { VerificationsController } from './verifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from './entities/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Verification])],
  controllers: [VerificationsController],
  providers: [VerificationsService],
})
export class VerificationsModule {}
