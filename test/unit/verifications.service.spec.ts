import { Test, TestingModule } from '@nestjs/testing';
import { VerificationsService } from '../../src/verifications/verifications.service';
import { TestModule } from '../../src/test.module';
import { Repository } from 'typeorm';
import { Verification } from '../../src/verifications/entities/verification.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

describe('VerificationsService', () => {
  let module: TestingModule;
  let service: VerificationsService;
  let verificationRepository: Repository<Verification>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Verification])],
      providers: [VerificationsService],
    }).compile();

    service = module.get<VerificationsService>(VerificationsService);
    verificationRepository = module.get(getRepositoryToken(Verification));
  });

  beforeEach(async () => {
    await setupTest();
  });

  afterEach(async () => {
    // Delete tables after each test
    await clear();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("createVerificationCode method test", function() {
    it('요청 성공 시 success,message,data를 리턴한다.', async () => {
      // Given
      // When
      const sut = await service.createVerificationCode()
      // Then
      expect(sut.success).toBe(true);
      expect(sut.message).toBe('SUCCESS CREATE VERIFICATION CODE');
      expect(sut.data).toBeDefined();
    })

    it('6자리 숫자로 된 인증번호를 리턴한다.', async () => {
      // Given
      // When
      const sut = await service.createVerificationCode()
      // Then
      expect(sut.data).toMatch(/^\d{4}$/)
    })
    
  });

  async function setupTest() {}

  async function clear() {
    jest.restoreAllMocks(); // 각 테스트가 종료될 때 마다 jest의 모든 모의를 초기화
    await verificationRepository.query('DELETE FROM verification;');
  }
});
