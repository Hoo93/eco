import { Test, TestingModule } from '@nestjs/testing';
import { PpurioService } from '../../src/sms/ppurio.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from "axios";

describe('PpurioService', () => {
  let service: PpurioService;
  let httpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [PpurioService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(), // HttpService의 post 메소드 모킹
          },
        },],
    }).compile();

    service = module.get(PpurioService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccessToken', () => {
    it('should fetch access token successfully', async () => {
      const result = { token: 'test_token', type: 'Bearer', expired: '3600' };

      const response = {
        data:result,
        status:200,
        headers:{url:"http://localhost"}, statusText: "",
        config:{url:"http://localhost",headers:{}},
        request:{}
      }

      jest.spyOn(httpService, 'post').mockImplementation(() => of(response));

      await service.setAccessToken();

      const accessToken = service.getAccessToken()

      expect(accessToken?.token).toEqual('test_token');
      expect(accessToken?.type).toEqual('Bearer');
      expect(accessToken?.expired).toEqual('3600');
    });
  });
});
