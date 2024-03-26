import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Verification } from './entities/verification.entity';
import { Repository } from 'typeorm';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { VerificationCode } from './verificationCodeResponse.dto';
import { CreateVerificationDto } from './create-verification.dto';

@Injectable()
export class VerificationsService {
  constructor(@InjectRepository(Verification) verificationRepository: Repository<Verification>) {}

  public createVerificationCode(): CommonResponseDto<VerificationCode> {
    return new CommonResponseDto('SUCCESS CREATE VERIFICATION CODE', new VerificationCode(this.generateSixDigitNumber()));
  }

  public async saveVerification(createVerificationDto: CreateVerificationDto): Promise<CommonResponseDto<any>> {
    return new CommonResponseDto('');
  }

  private generateSixDigitNumber(): string {
    let result = '';

    for (let i = 0; i < 6; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }
}
