import { SmsInterface } from './sms.interface';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { LocalDateTime } from '@js-joda/core';
import { ConfigService } from '@nestjs/config';
import { PPURIO_CONST } from './const/ppurio-const';
import { PpurioAccessToken } from './const/ppurio-access-token.interface';

@Injectable()
export class PpurioService implements SmsInterface {
  private readonly PPURIO_ACCOUNT = this.configService.get<string>('PPURIO_ACCOUNT');
  private readonly API_KEY = this.configService.get<string>('API_KEY');
  private readonly URI = this.configService.get<string>('URI');
  private readonly FROM = this.configService.get<string>('FROM');
  private readonly REF_KEY = this.configService.get<string>('REF_KEY');

  private access_token: PpurioAccessToken;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  public async requestSend(content: string, targetMobileNumber: string) {
    const now = LocalDateTime.now();
    if (!this.access_token || now.isAfter(this.access_token.expired)) {
      await this.setAccessToken();
    }

    if (!this.isValidContent(content)) {
      throw new BadRequestException('문자열은 90Byte를 넘길 수 없습니다.');
    }

    const headers = this.createHeader();
    const request_body = this.createRequestBody(content, targetMobileNumber);

    try {
      return await lastValueFrom(
        this.httpService.post(this.URI + '/v1/message', request_body, { headers }).pipe(map((response) => response.data)),
      );
    } catch (error) {
      console.error('Error fetching sending message:', error);
      throw error;
    }
  }

  public async setAccessToken(): Promise<void> {
    const encodedCredentials = this.encodeCredentials();

    const headers = {
      Authorization: `Basic ${encodedCredentials}`,
    };

    const endPoint = this.URI + '/v1/token';

    try {
      const ppurioAccessToken = await lastValueFrom(
        this.httpService.post(endPoint, {}, { headers }).pipe(map((response) => response.data)),
      );
      ppurioAccessToken.expired = this.convertToDateTime(ppurioAccessToken.expired);
      this.access_token = ppurioAccessToken;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw error;
    }
  }

  public getAccessToken(): PpurioAccessToken {
    return this.access_token;
  }

  private encodeCredentials(): string {
    return Buffer.from(`${this.PPURIO_ACCOUNT}:${this.API_KEY}`).toString('base64');
  }

  private isValidContent(content: string): boolean {
    return this.getByteSize(content) <= PPURIO_CONST.MAXIMUM_BYTE;
  }

  private getByteSize(content: string): number {
    let size = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      if (char < 128) {
        size += 1;
      } else if (char < 2048) {
        size += 2;
      } else if (char < 65536) {
        size += 3;
      } else {
        size += 4;
      }
    }
    return size;
  }

  private convertToDateTime(input: string): LocalDateTime {
    // 입력된 문자열을 `yyyy-MM-ddTHH:mm:ss` 형식으로 변환
    const formattedInput = `${input.substring(0, 4)}-${input.substring(4, 6)}-${input.substring(6, 8)}T${input.substring(8, 10)}:${input.substring(10, 12)}:${input.substring(12, 14)}`;
    return LocalDateTime.parse(formattedInput);
  }

  private createHeader() {
    return {
      Authorization: `Bearer ${this.access_token.token}`,
    };
  }

  private createRequestBody(content: string, targetMobileNumber: string) {
    const request_body = {
      account: this.PPURIO_ACCOUNT,
      messageType: 'SMS',
      content: content,
      from: this.FROM,
      duplicateFlag: 'N',
      targets: [{ to: targetMobileNumber }],
      targetCount: 0,
      refKey: this.REF_KEY,
    };
    request_body.targetCount = request_body.targets.length;
    return request_body;
  }
}
