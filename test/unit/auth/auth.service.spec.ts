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
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserType } from '../../../src/auth/const/user-type.enum';
import { VerificationsService } from "../../../src/verifications/verifications.service";
import { Verification } from "../../../src/verifications/entities/verification.entity";

describe('MemberAuthService Test', function () {
  let module: TestingModule;
  let service: AuthService;
  let memberRepository: Repository<Member>;
  let memberLoginHistoryRepository: Repository<MemberLoginHistory>;
  let verificationRepository: Repository<Verification>;
  let jwtService: MockJwtService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Member, MemberLoginHistory,Verification])],
      providers: [
        AuthService,
        VerificationsService,
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<MockJwtService>(JwtService);
    memberRepository = module.get(getRepositoryToken(Member));
    memberLoginHistoryRepository = module.get(getRepositoryToken(MemberLoginHistory));
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

  it('authService should be defined', function () {
    expect(service).toBeDefined();
    expect(service.signup).toBeDefined();
  });

  describe("signup method test", function() {
    it('최근 인증 내역이 있는 경우에만 회원가입 할 수 있다.',async () => {
      // Given
      const dto = new CreateMemberDto();
      dto.username = 'testID';
      dto.type = MemberType.GENERAL;
      dto.password = 'testpwd123!';
      dto.name = 'testname';
      dto.mobileNumber = '01080981398';
      dto.birthday = '1117';
      dto.email = 'sksk8922@gmail.com';
      dto.nickname = '불꽃방구 어피치';

      // When, Then
      await expect(async () => {
        await service.signup(dto);
      }).rejects.toThrow()
    })
    
    it('요청 성공시 success, message를 리턴한다', async () => {
      // Given
      const dto = new CreateMemberDto();
      dto.username = 'testID';
      dto.type = MemberType.GENERAL;
      dto.password = 'testpwd123!';
      dto.name = 'testname';
      dto.mobileNumber = '01080981398';
      dto.birthday = '1117';
      dto.email = 'sksk8922@gmail.com';
      dto.nickname = '불꽃방구 어피치';

      const verification = new Verification()
      verification.mobileNumber = dto.mobileNumber;
      verification.code = '000000';
      verification.isVerified = true;

      await verificationRepository.insert(verification)

      // When
      const signupResult = await service.signup(dto);

      // Then
      expect(signupResult.success).toBeTruthy();
      expect(signupResult.message).toBe('SUCCESS SIGNUP');
    });

    it('signup return User without password', async () => {
      // Given
      const dto = new CreateMemberDto();
      dto.username = 'testID';
      dto.type = MemberType.GENERAL;
      dto.password = 'testpwd123!';
      dto.name = 'testname';
      dto.mobileNumber = '01080981398';
      dto.birthday = '1117';
      dto.email = 'sksk8922@gmail.com';
      dto.nickname = '불꽃방구 어피치';

      const verification = new Verification()
      verification.mobileNumber = dto.mobileNumber;
      verification.code = '000000';
      verification.isVerified = true;

      await verificationRepository.insert(verification)

      // When
      const signupResult = await service.signup(dto);

      // Then
      expect(signupResult.success).toBeTruthy();
      expect(signupResult.message).toBe('SUCCESS SIGNUP');
      expect(signupResult.data.username).toBe('testID');
      expect(signupResult.data.type).toBe(MemberType.GENERAL);
      expect(signupResult.data.name).toBe('testname');
      expect(signupResult.data.mobileNumber).toBe('01080981398');
      expect(signupResult.data.birthday).toBe('1117');
      expect(signupResult.data.email).toBe('sksk8922@gmail.com');
      expect(signupResult.data.nickname).toBe('불꽃방구 어피치');
      expect(signupResult.data.password).not.toBeDefined();
    });
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
      testMember.nickname = '불꽃방구 어피치';

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
      testMember.nickname = '불꽃방구 어피치';

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
      jest.spyOn(bcrypt, 'compare').mockReturnValue();

      const testMember = new Member();
      testMember.id = 'test';
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'test@email.com';
      testMember.mobileNumber = '01080981398';
      testMember.type = MemberType.GENERAL;
      testMember.createId = 'test';
      testMember.nickname = '불꽃방구 어피치';

      await memberRepository.insert(testMember);

      const signInDto = new SignInDto();
      signInDto.username = '박상후';
      signInDto.password = 'wrongpassword';

      const ip = '127.0.0.1';

      // When, Then
      await expect(async () => {
        await service.signIn(signInDto, ip);
      }).rejects.toThrow(BadRequestException);
    });

    it('isAutoLogin = true 인 경우 refresh-token의 만료기간이 30d 이다.', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const testMember = new Member();
      testMember.id = 'test';
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'test@email.com';
      testMember.mobileNumber = '01080981398';
      testMember.type = MemberType.GENERAL;
      testMember.createId = 'test';
      testMember.nickname = '불꽃방구 어피치';

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
        2, // refreshToken 생성은 두 번째 호출
        expect.any(Object),
        expect.objectContaining({
          expiresIn: '30d',
        }),
      );
    });

    it('isAutoLogin undefined 인 경우 refresh-token의 만료기간이 1d 이다.', async () => {
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
      testMember.nickname = '불꽃방구 어피치';

      await memberRepository.insert(testMember);

      const signInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';

      const ip = '127.0.0.1';

      const jwtSpy = jest.spyOn(jwtService, 'sign');

      // When
      await service.signIn(signInDto, ip);

      // Then
      expect(jwtSpy).toHaveBeenNthCalledWith(
        2, // refreshToken 생성은 두 번째 호출
        expect.any(Object),
        expect.objectContaining({
          expiresIn: '1d',
        }),
      );
    });

    it('isAutoLogin = true 인 경우 member isAutoLogin = true로 업데이트한다.', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));
      jest.spyOn(jwtService, 'sign').mockImplementationOnce(() => Promise.resolve('token'));

      const testMember = new Member();
      testMember.id = 'test';
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'test@email.com';
      testMember.mobileNumber = '01080981398';
      testMember.type = MemberType.GENERAL;
      testMember.createId = 'test';
      testMember.nickname = '불꽃방구 어피치';

      await memberRepository.insert(testMember);

      const signInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';
      signInDto.isAutoLogin = true;

      const ip = '127.0.0.1';

      const jwtSpy = jest.spyOn(jwtService, 'sign');

      // When
      await service.signIn(signInDto, ip);
      const sut = await memberRepository.findOneBy({ id: testMember.id });

      // Then
      expect(sut.isAutoLogin).toBeTruthy();
    });

    it('isAutoLogin = undefined 인 경우 member isAutoLogin = false로 업데이트한다.', async () => {
      // Given
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));
      jest.spyOn(jwtService, 'sign').mockImplementationOnce(() => Promise.resolve('token'));

      const testMember = new Member();
      testMember.id = 'test';
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'test@email.com';
      testMember.mobileNumber = '01080981398';
      testMember.type = MemberType.GENERAL;
      testMember.createId = 'test';
      testMember.nickname = '불꽃방구 어피치';

      testMember.isAutoLogin = true;

      await memberRepository.insert(testMember);

      const signInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';

      const ip = '127.0.0.1';

      const jwtSpy = jest.spyOn(jwtService, 'sign');

      // When
      await service.signIn(signInDto, ip);
      const sut = await memberRepository.findOneBy({ id: testMember.id });

      // Then
      expect(sut.isAutoLogin).toBeFalsy();
    });
  });

  describe('refreshToken method test', () => {
    it('refreshToken 이 유효하지 않은 경우 UnauthorizedException을 발생한다.', async () => {
      // Given
      jest.spyOn(jwtService, 'verify').mockImplementationOnce(() => Promise.resolve(true));

      const refreshToken = 'refresh_token';

      const ip = '127.0.0.1';

      // When, Then
      await expect(service.refreshToken(refreshToken, ip)).rejects.toThrow(UnauthorizedException);
    });

    it('회원의 저장된 refresh_token과 입력한 refresh_token이 다른 경우 에러를 발생한다.', async () => {
      // Given
      const refreshToken = 'refresh_token';

      const testMember = new Member();
      testMember.id = 'test';
      testMember.type = MemberType.GENERAL;
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'test@email.com';
      testMember.mobileNumber = '01080981398';
      testMember.createId = 'test';
      testMember.refreshToken = 'invalid_refresh_token';
      testMember.nickname = '불꽃방구 어피치';

      const loginHistory = new MemberLoginHistory();
      loginHistory.id = 1;
      loginHistory.memberId = 'test';
      loginHistory.member = testMember;
      loginHistory.currentIp = '127.0.0.1';
      loginHistory.loginAt = new Date('2024-03-17 08:00:000');

      await memberRepository.insert(testMember);
      await memberLoginHistoryRepository.insert(loginHistory);

      const jwtPayload = {
        id: testMember.id,
        username: testMember.username,
        userType: UserType.MEMBER,
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(jwtPayload);

      const ip = '127.0.0.1';

      // When, Then
      await expect(async () => {
        await service.refreshToken(refreshToken, ip);
      }).rejects.toThrow(new UnauthorizedException('리프레시토큰이 유효하지 않습니다.'));
    });

    it('현재 ip와 마지막으로 로그인 한 ip가 다른 경우 에러를 발생한다.', async () => {
      // Given
      const refreshToken = 'refresh_token';

      const testMember = new Member();
      testMember.id = 'test';
      testMember.type = MemberType.GENERAL;
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'test@email.com';
      testMember.mobileNumber = '01080981398';
      testMember.createId = 'test';
      testMember.refreshToken = 'refresh_token';
      testMember.nickname = '불꽃방구 어피치';

      const loginHistory = new MemberLoginHistory();
      loginHistory.id = 1;
      loginHistory.memberId = 'test';
      loginHistory.member = testMember;
      loginHistory.currentIp = '127.0.0.1';
      loginHistory.loginAt = new Date('2024-03-17 08:00:000');

      await memberRepository.insert(testMember);
      await memberLoginHistoryRepository.insert(loginHistory);

      const jwtPayload = {
        id: testMember.id,
        username: testMember.username,
        userType: UserType.MEMBER,
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(jwtPayload);

      const ip = '123.101.103.105';

      // When, Then
      await expect(async () => {
        await service.refreshToken(refreshToken, ip);
      }).rejects.toThrow(new UnauthorizedException('마지막으로 로그인 한 기기가 아닙니다.'));
    });
  });

  describe('isAvailableEmail method test', () => {
    it('이미 이메일이 존재하는 경우 false를 반환한다.', async () => {
      // Given
      const validationTargetEmail = 'myEmail@naver.com';

      const testMember = new Member();
      testMember.email = 'myEmail@naver.com';
      testMember.id = 'test';
      testMember.type = MemberType.GENERAL;
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.mobileNumber = '01080981398';
      testMember.createId = 'test';
      testMember.refreshToken = 'refresh_token';
      testMember.nickname = '불꽃방구 어피치';

      await memberRepository.insert(testMember);

      // When
      const sut = await service.isAvailableEmail(validationTargetEmail);

      // Then
      expect(sut.success).toBeTruthy();
      expect(sut.data.isAvailable).toBe(false);
    });

    it('이메일이 존재하지 않는 경우 true를 반환한다.', async () => {
      // Given
      const validationTargetEmail = 'myEmail@naver.com';

      // When
      const sut = await service.isAvailableEmail(validationTargetEmail);

      // Then
      expect(sut.success).toBeTruthy();
      expect(sut.data.isAvailable).toBeTruthy();
    });
  });

  describe('isAvailableNickname method test', () => {
    it('이미 닉네임이 존재하는 경우 false를 반환한다.', async () => {
      // Given
      const validationTargetNickname = '불꽃방구 어피치';

      const testMember = new Member();
      testMember.mobileNumber = '01080981398';
      testMember.id = 'test';
      testMember.type = MemberType.GENERAL;
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'myEmail@naver.com';
      testMember.createId = 'test';
      testMember.refreshToken = 'refresh_token';
      testMember.nickname = '불꽃방구 어피치';

      await memberRepository.insert(testMember);

      // When
      const sut = await service.isAvailableNickname(validationTargetNickname);

      // Then
      expect(sut.success).toBeTruthy();
      expect(sut.data.isAvailable).toBe(false);
    });

    it('닉네임이 존재하지 않는 경우 true를 반환한다.', async () => {
      // Given
      const validationTargetNickname = '불꽃방구 어피치';

      // When
      const sut = await service.isAvailableNickname(validationTargetNickname);

      // Then
      expect(sut.success).toBeTruthy();
      expect(sut.data.isAvailable).toBe(true);
    });
  });

  describe('isAvailableMobileNumber method test', () => {
    it('이미 핸드폰번호가 존재하는 경우 false를 반환한다.', async () => {
      // Given
      const validationTargetMobileNumber = '01080981398';

      const testMember = new Member();
      testMember.mobileNumber = '01080981398';
      testMember.id = 'test';
      testMember.type = MemberType.GENERAL;
      testMember.name = '박상후';
      testMember.username = 'TestUser1';
      testMember.password = 'pwd123!@#';
      testMember.email = 'myEmail@naver.com';
      testMember.createId = 'test';
      testMember.refreshToken = 'refresh_token';
      testMember.nickname = '불꽃방구 어피치';

      await memberRepository.insert(testMember);

      // When
      const sut = await service.isAvailableMobileNumber(validationTargetMobileNumber);

      // Then
      expect(sut.success).toBeTruthy();
      expect(sut.data.isAvailable).toBe(false);
    });

    it('핸드폰번호가 존재하지 않는 경우 true를 반환한다.', async () => {
      // Given
      const validationTargetMobileNumber = '01080981398';

      // When
      const sut = await service.isAvailableMobileNumber(validationTargetMobileNumber);

      // Then
      expect(sut.success).toBeTruthy();
      expect(sut.data.isAvailable).toBe(true);
    });
  });

  async function setupTest() {}

  async function clear() {
    jest.restoreAllMocks(); // 각 테스트가 종료될 때 마다 jest의 모든 모의를 초기화
    await memberLoginHistoryRepository.query('DELETE FROM member_login_history;');
    await verificationRepository.query('DELETE FROM verification;');
    await memberRepository.query('DELETE FROM member;');
  }
});
