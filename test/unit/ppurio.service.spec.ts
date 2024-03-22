import { Test, TestingModule } from '@nestjs/testing';
import { PpurioService } from '../../src/sms/ppurio.service';
import { HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { LocalDateTime } from '@js-joda/core';

describe('PpurioService', () => {
  let service: PpurioService;
  let httpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        PpurioService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(), // HttpService의 post 메소드 모킹
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              switch (key) {
                case 'PPURIO_ACCOUNT':
                  return 'test_account';
                case 'API_KEY':
                  return 'test_key';
                case 'URI':
                  return 'test_uri';
                case 'FROM':
                  return 'test_from';
                // 추가 설정값 필요시 여기에 추가
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get(PpurioService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setAccessToken', () => {
    it('Ppurio.service에 access_token을 저장한다.', async () => {
      // Given
      const mock_access_token = {
        token: 'test_token',
        type: 'Bearer',
        expired: '20241231000000',
      };

      const response = {
        data: mock_access_token,
        status: 200,
        headers: {},
        statusText: '',
        config: { url: 'http://localhost', headers: {} },
        request: {},
      };

      jest.spyOn(httpService, 'post').mockImplementation(() => of(response));

      // When
      await service.setAccessToken();

      const accessToken = service.getAccessToken();

      // Then
      expect(accessToken?.token).toEqual('test_token');
      expect(accessToken?.type).toEqual('Bearer');
      expect(accessToken?.expired).toEqual(LocalDateTime.of(2024, 12, 31, 0, 0, 0));
    });
  });

  describe('requestSend', () => {
    it('should send SMS successfully', async () => {
      // getAccessToken을 호출할 때 이미 토큰을 세팅하는 것으로 가정
      service['access_token'] = {
        token: 'test_token',
        type: 'Bearer',
        expired: LocalDateTime.parse('2024-12-31T00:00:00'),
      };

      const response = {
        data: {
          success: true,
          message: 'SMS sent successfully',
        },
      };
      jest.spyOn(httpService, 'post').mockReturnValue(of(response));

      const result = await service.requestSend('Test message', '01012345678');
      expect(result.success).toBeTruthy();
      expect(result.message).toEqual('SMS sent successfully');
    });

    it('메시지 내용이 90바이트가 넘으면 오류를 발생시킨다.', async () => {
      // getAccessToken을 호출할 때 이미 토큰을 세팅하는 것으로 가정
      service['access_token'] = {
        token: 'test_token',
        type: 'Bearer',
        expired: LocalDateTime.parse('2024-12-31T00:00:00'),
      };

      const invalidContent = 'a'.repeat(91);

      await expect(async () => await service.requestSend(invalidContent, '01012345678')).rejects.toThrow(BadRequestException);
    });
  });
});
