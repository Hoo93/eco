import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/member/auth.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../../../src/auth/dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { MockJwtService } from './mockJwtService';
import { Repository } from 'typeorm';
import { Member } from '../../../src/members/entities/member.entity';
import { CreateMemberDto } from '../../../src/auth/member/dto/create-member.dto';
import { TestModule } from '../../../src/test.module';
import { MemberType } from '../../../src/auth/const/member-type.enum';
import { MemberLoginHistory } from '../../../src/auth/member/entity/login-history.entity';
import { BadRequestException } from '@nestjs/common';

describe('MemberAuthService Test', function () {
  let module: TestingModule;
  let service: AuthService;
  let memberRepository: Repository<Member>;
  let memberLoginHistoryRepository: Repository<MemberLoginHistory>;
  let jwtService: MockJwtService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Member, MemberLoginHistory])],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    memberRepository = module.get(getRepositoryToken(Member));
    memberLoginHistoryRepository = module.get(getRepositoryToken(MemberLoginHistory));
    jwtService = module.get<MockJwtService>(JwtService);
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

  it('authService should be defined', function () {
    expect(service).toBeDefined();
    expect(service.signup).toBeDefined();
  });

  it('signup return User without password', async () => {
    const dto = new CreateMemberDto();
    dto.username = 'testID';
    dto.type = MemberType.GENERAL;
    dto.password = 'testpwd123!';
    dto.name = 'testname';
    dto.mobileNumber = '010-8098-1398';
    dto.birthday = '1117';
    dto.email = 'sksk8922@gmail.com';

    const signupResult = await service.signup(dto);
    expect(signupResult.success).toBeTruthy();
    expect(signupResult.message).toBe('SUCCESS SIGNUP');
    expect(signupResult.data.username).toBe('testID');
    expect(signupResult.data.type).toBe(MemberType.GENERAL);
    expect(signupResult.data.name).toBe('testname');
    expect(signupResult.data.mobileNumber).toBe('010-8098-1398');
    expect(signupResult.data.birthday).toBe('1117');
    expect(signupResult.data.email).toBe('sksk8922@gmail.com');
    expect(signupResult.data.password).not.toBeDefined();
  });

  describe('signIn method test', () => {
    it('should return access-token and refresh-token', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const testMember = new Member();
      testMember.id = 'test';
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'test@email.com';
      testMember.mobileNumber = '01080981398';
      testMember.type = MemberType.GENERAL;
      testMember.createId = 'test';

      await memberRepository.insert(testMember);

      const signInDto: SignInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';

      const ip = '127.0.0.1';

      // When
      const result = await service.signIn(signInDto, ip);

      // Then
      expect(result.success).toBeTruthy();
      expect(result.message).toBe('SUCCESS SIGNIN');
      expect(result.data).toHaveProperty('accessToken');
      expect(result.data).toHaveProperty('refreshToken');
    });

    it('로그인 일시와 IP를 기록한다.', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const ip = '127.0.0.1';

      const testMember = new Member();
      testMember.id = 'test';
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'test@email.com';
      testMember.mobileNumber = '01080981398';
      testMember.type = MemberType.GENERAL;
      testMember.createId = 'test';

      await memberRepository.insert(testMember);

      const signInDto: SignInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';

      // When
      const now = new Date('2024-03-16 18:00:00');
      await service.signIn(signInDto, ip, now);
      const sut = await memberLoginHistoryRepository.findOneBy({ memberId: testMember.id });

      // Then
      expect(sut?.currentIp).toBe('127.0.0.1');
      expect(sut?.loginAt).toStrictEqual(now);
    });

    it('비밀번호가 정확하지 않은 경우 에러를 발생시킨다.', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false));

      const testMember = new Member();
      testMember.id = 'test';
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'test@email.com';
      testMember.mobileNumber = '01080981398';
      testMember.type = MemberType.GENERAL;
      testMember.createId = 'test';

      await memberRepository.insert(testMember);

      const signInDto = new SignInDto();
      signInDto.username = '박상후';
      signInDto.password = 'wrongpassword';

      const ip = '127.0.0.1';

      // When, Then
      await expect(service.signIn(signInDto, ip)).rejects.toThrow(BadRequestException);
    });

    it('isAutoLogin = true 인 경우 refresh-token의 만료기간이 30d 이다.', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const testMember = new Member();
      testMember.id = 'test';
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'test@email.com';
      testMember.mobileNumber = '01080981398';
      testMember.type = MemberType.GENERAL;
      testMember.createId = 'test';

      await memberRepository.insert(testMember);

      const signInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';
      signInDto.isAutoLogin = true;

      const ip = '127.0.0.1';

      const jwtSpy = jest.spyOn(jwtService, 'sign');

      // When
      await service.signIn(signInDto, ip);

      // Then
      expect(jwtSpy).toHaveBeenNthCalledWith(
        2, // refreshToken 생성이 두 번째 호출이라고 가정
        expect.any(Object), // 첫 번째 인자는 payload로, 특정 구조를 가지고 있을 것입니다.
        expect.objectContaining({
          expiresIn: '30d',
          secret: 'This is my super super secret', // 여기서 중요한 부분은 expiresIn 값이 '30d'인지 확인하는 것입니다.
        }),
      );
    });
  });

  async function setupTest() {}

  async function clear() {
    await memberLoginHistoryRepository.query('DELETE FROM member_login_history;');
    await memberRepository.query('DELETE FROM member;');
  }
});
