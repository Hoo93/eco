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

  async function setupTest() {}

  async function clear() {
    jest.restoreAllMocks(); // 각 테스트가 종료될 때 마다 jest의 모든 모의를 초기화
    await verificationRepository.query('DELETE FROM verification;');
  }
});
