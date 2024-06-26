import { Body, Controller, Get, Post } from '@nestjs/common';
import { PpurioService } from './ppurio.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSmsDto } from './const/create-sms.dto';

@ApiTags('sms')
@Controller('sms')
export class SmsController {
  constructor(private readonly ppruioService: PpurioService) {}

  @Get()
  @ApiOperation({ summary: '뿌리오 엑세스 토큰 발급' })
  getAccessToken() {
    return this.ppruioService.getAccessToken();
  }

  @Post()
  @ApiOperation({ summary: '뿌리오 엑세스 토큰 발급' })
  @ApiBody({
    type: CreateSmsDto,
    description: '리프레시토큰 DTO',
  })
  sendRequest(@Body() createSmsDto: CreateSmsDto) {
    console.log(createSmsDto);
    return this.ppruioService.requestSend(createSmsDto.context, createSmsDto.targetMobileNumber);
  }
}
