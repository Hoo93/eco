import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/users/entities/user.entity';
import { MockUserRepository } from './mockUserRepository';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/auth.service';
import { CreateAuthDto } from '../../../src/auth/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../../../src/auth/dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { MockJwtService } from './mockJwtService';

describe('AuthService Test', function () {
  let service: AuthService;
  let userRepository: MockUserRepository;
  let jwtService: MockJwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<MockUserRepository>(getRepositoryToken(User));
    jwtService = module.get<MockJwtService>(JwtService);
  });

  it('authService should be defined', function () {
    expect(service).toBeDefined();
    expect(service.signup).toBeDefined();
  });

  it('signup return User without password', async () => {
    const dto = new CreateAuthDto();
    dto.username = 'testID';
    dto.password = 'testpwd123!';
    dto.name = 'testname';
    dto.mobileNumber = '010-8098-1398';
    dto.birthday = '931117';
    dto.email = 'sksk8922@gmail.com';

    const signupResult = await service.signup(dto);
    expect(signupResult.username).toBe(dto.username);
    expect(signupResult.name).toBe(dto.name);
    expect(signupResult.mobileNumber).toBe(dto.mobileNumber);
    expect(signupResult.birthday).toBe(dto.birthday);
    expect(signupResult.email).toBe(dto.email);

    expect(signupResult.password).not.toBeDefined();
  });

  describe('Validate Method Test', () => {
    it('should return User without password', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const username = 'TestUser1';

      const found = await userRepository.findOne({
        where: { username: username },
      });

      const result = await service.validateUser('TestUser1', 'pwd123!@#');
      expect(result).toEqual(found);
    });
  });

  describe('signIn method test', () => {
    it('should return access-token', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      const signInDto: SignInDto = new SignInDto();
      signInDto.username = 'TestUser1';
      signInDto.password = 'pwd123!@#';

      const result = await service.signIn(signInDto);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('refreshToken method test', () => {
    it('should return ', async () => {
      // Given
      // When
      // Then
    });
  });
});
