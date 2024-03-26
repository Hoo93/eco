import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Verification } from './entities/verification.entity';
import { InsertResult, Repository } from 'typeorm';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { VerificationCode } from './verificationCodeResponse.dto';
import { CreateVerificationDto } from './create-verification.dto';
import { IdResponseDto } from '../common/response/id-response.dto';
import { VerifyCodeDto } from './verificate-code.dto';

@Injectable()
export class VerificationsService {
  constructor(@InjectRepository(Verification) private verificationRepository: Repository<Verification>) {}

  public createVerificationCode(): CommonResponseDto<VerificationCode> {
    return new CommonResponseDto('SUCCESS CREATE VERIFICATION CODE', new VerificationCode(this.generateSixDigitNumber()));
  }

  public async saveVerification(createVerificationDto: CreateVerificationDto): Promise<CommonResponseDto<IdResponseDto>> {
    const result: InsertResult = await this.verificationRepository.insert({ ...createVerificationDto });
    if (result.raw.affectedRows <= 0) {
      throw new BadRequestException('인증코드 생성에 실패했습니다.');
    }
    return new CommonResponseDto('SUCCESS SAVE VERIFICATION CODE', { id: result.identifiers[0].id });
  }

  public async verifyCode(verifyCodeDto: VerifyCodeDto): Promise<CommonResponseDto<any>> {
    const verification = await this.verificationRepository.findOneBy({ id: verifyCodeDto.id });
    if (!verification) {
      throw new BadRequestException('해당 인증내역이 존재하지 않습니다.');
    }
    if (!verification.isEqual(verifyCodeDto.code)) {
      throw new BadRequestException('인증코드가 일치하지 않습니다.');
    }
    await this.verificationRepository.update(verifyCodeDto.id, { isVerified: true });
    return new CommonResponseDto('인증에 성공했습니다.');
  }

  private generateSixDigitNumber(): string {
    let result = '';

    for (let i = 0; i < 6; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }
}
