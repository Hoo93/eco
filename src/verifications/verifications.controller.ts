import { Body, Controller, Post } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { AuthenticationRequestDto } from './const/authentication-request.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { IdResponseDto } from '../common/response/id-response.dto';
import { PpurioService } from '../sms/ppurio.service';
import { CreateVerificationDto } from './const/create-verification.dto';
import { VerifyCodeDto } from './const/verificate-code.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('verifications')
@ApiTags('[서비스] 인증요청')
export class VerificationsController {
  constructor(
    private readonly verificationsService: VerificationsService,
    private readonly ppurioService: PpurioService,
  ) {}

  @Post('/authentication')
  @ApiOperation({ summary: '인증번호 발급' })
  @ApiResponse({
    status: 200,
    description: '인증번호 발급',
    type: CommonResponseDto<IdResponseDto>,
  })
  @ApiBody({
    type: AuthenticationRequestDto,
    description: '인증번호 생성 요청 DTO',
  })
  public async sendVerificationCode(
    @Body() authenticationRequestDto: AuthenticationRequestDto,
  ): Promise<CommonResponseDto<IdResponseDto>> {
    const code = this.verificationsService.createVerificationCode();

    const content = `[Eco-Billiards] 본인확인 인증번호[${code}]를 화면에 입력해 주세요.`;

    await this.ppurioService.requestSend(content, authenticationRequestDto.mobileNumber);

    const createVerificationDto = new CreateVerificationDto();
    createVerificationDto.code = code.data.verificationCode;
    createVerificationDto.mobileNumber = authenticationRequestDto.mobileNumber;

    return await this.verificationsService.saveVerification(createVerificationDto);
  }

  @Post('/verify')
  @ApiOperation({ summary: '인증번호 검증' })
  @ApiResponse({
    status: 200,
    description: '인증번호 검증',
    type: CommonResponseDto<any>
  })
  @ApiBody({
    type: VerifyCodeDto,
    description: '인증 요청 DTO',
  })
  public async verifyCode(@Body() verifyCodeDto: VerifyCodeDto): Promise<CommonResponseDto<any>> {
    return await this.verificationsService.verifyCode(verifyCodeDto);
  }
}
