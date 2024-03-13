import { plainToInstance } from 'class-transformer';
import { CreateAuthDto } from '../../../src/auth/dto/create-auth.dto';
import { validate } from 'class-validator';
import {
  INVALID_EMAIL_MESSAGE,
  INVALID_ID_MAX_LENGTH_MESSAGE,
  INVALID_ID_MESSAGE,
  INVALID_ID_MIN_LENGTH_MESSAGE,
  INVALID_MOBILENUMBER_MESSAGE,
  INVALID_NAME_MAX_LENGTH_MESSAGE,
  INVALID_NAME_MESSAGE,
  INVALID_NAME_MIN_LENGTH_MESSAGE,
  INVALID_PASSWORD_MAX_LENGTH_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  INVALID_PASSWORD_MIN_LENGTH_MESSAGE,
} from '../../../src/auth/const/error-message';
import { User } from '../../../src/users/entities/user.entity';

describe('create-auth.dto TEST', () => {
  let createAuthDto: CreateAuthDto;

  beforeEach(() => {
    const dto = {
      username: 'testID',
      password: 'testpwd123!',
      name: 'testname',
      mobileNumber: '010-8098-1398',
      age: 31,
      email: 'sksk8922@gmail.com',
    };
    createAuthDto = plainToInstance(CreateAuthDto, dto);
  });

  it('toEntity should return User Instance', () => {
    const user = createAuthDto.toEntity();

    expect(user).toBeInstanceOf(User);

    expect(user.username).toBe(createAuthDto.username);
    expect(user.password).toBe(createAuthDto.password);
    expect(user.name).toBe(createAuthDto.name);
    expect(user.mobileNumber).toBe(createAuthDto.mobileNumber);
  });

  it('이름은 한글,영문로 이루어져야 합니다.', async () => {
    const invalidName = 'noSpecial#';
    createAuthDto.name = invalidName;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_NAME_MESSAGE);
  });

  it('이름은 6글자 이상이어야 합니다.', async () => {
    const tooShortName = '짧';
    createAuthDto.name = tooShortName;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.minLength).toBe(INVALID_NAME_MIN_LENGTH_MESSAGE);
  });

  it('이름은 20글자 이하이어야 합니다.', async () => {
    const tooLongName = 'ThisNameIsTooLongForOurSystem';
    createAuthDto.name = tooLongName;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.maxLength).toBe(INVALID_NAME_MAX_LENGTH_MESSAGE);
  });

  it('비밀번호는 각각 최소 1개 이상의 한글,영문,숫자로 이루어져야 합니다.', async () => {
    const invalidPassword = 'noSpecial#';
    createAuthDto.password = invalidPassword;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_PASSWORD_MESSAGE);
  });

  it('비밀번호는 6글자 이상이어야 합니다.', async () => {
    const tooShortPassword = 'a1#';
    createAuthDto.password = tooShortPassword;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.minLength).toBe(INVALID_PASSWORD_MIN_LENGTH_MESSAGE);
  });

  it('비밀번호는 12글자 이하이어야 합니다.', async () => {
    const tooLongPassword = 'abcd123456789!';
    createAuthDto.password = tooLongPassword;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.maxLength).toBe(INVALID_PASSWORD_MAX_LENGTH_MESSAGE);
  });

  it('아이디는 영문,숫자로 이루어져야 합니다.', async () => {
    const invalidId = 'noSpecial#';
    createAuthDto.username = invalidId;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_ID_MESSAGE);
  });

  it('아이디는 6글자 이상이어야 합니다.', async () => {
    const tooShortId = 'a1#';
    createAuthDto.username = tooShortId;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.minLength).toBe(INVALID_ID_MIN_LENGTH_MESSAGE);
  });

  it('아이디는 12글자 이하이어야 합니다.', async () => {
    const tooLongId = 'abcd123456789!';
    createAuthDto.username = tooLongId;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.maxLength).toBe(INVALID_ID_MAX_LENGTH_MESSAGE);
  });

  it('휴대폰 번호의 공백과 - 을 제거한다.', async () => {
    const invalidMobileNumber = '010-8098- 1398';
    createAuthDto.mobileNumber = invalidMobileNumber;

    createAuthDto = plainToInstance(CreateAuthDto, createAuthDto);

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors).toHaveLength(0);
  });

  it('이메일주소는 XXXX@XXXX.XXX 형식이어야 합니다.', async () => {
    const invalidEmail = 'invalidEmailAddress';
    createAuthDto.email = invalidEmail;

    const validationErrors = await validate(createAuthDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_EMAIL_MESSAGE);
  });
});
