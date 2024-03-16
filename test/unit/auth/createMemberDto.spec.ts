import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  INVALID_BIRTHDAY_MESSAGE,
  INVALID_BIRTHYEAR_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  INVALID_ID_MAX_LENGTH_MESSAGE,
  INVALID_ID_MESSAGE,
  INVALID_ID_MIN_LENGTH_MESSAGE,
  INVALID_NAME_MAX_LENGTH_MESSAGE,
  INVALID_NAME_MESSAGE,
  INVALID_NAME_MIN_LENGTH_MESSAGE,
  INVALID_PASSWORD_MAX_LENGTH_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  INVALID_PASSWORD_MIN_LENGTH_MESSAGE,
} from '../../../src/auth/const/error-message';
import { User } from '../../../src/common/entities/user.entity';
import { CreateMemberDto } from '../../../src/auth/member/dto/create-member.dto';
import { MemberType } from '../../../src/auth/const/member-type.enum';

describe('create-member.dto TEST', () => {
  let createMemberDto: CreateMemberDto;

  beforeEach(() => {
    const dto = {
      username: 'testID',
      type: MemberType.GENERAL,
      password: 'testpwd123!',
      name: 'testname',
      mobileNumber: '010-8098-1398',
      age: 31,
      email: 'sksk8922@gmail.com',
    };
    createMemberDto = plainToInstance(CreateMemberDto, dto);
  });

  it('toEntity should return User Instance', () => {
    const user = createMemberDto.toEntity();

    expect(user).toBeInstanceOf(User);

    expect(user.username).toBe(createMemberDto.username);
    expect(user.password).toBe(createMemberDto.password);
    expect(user.name).toBe(createMemberDto.name);
    expect(user.mobileNumber).toBe(createMemberDto.mobileNumber);
  });

  it('이름은 한글,영문로 이루어져야 합니다.', async () => {
    const invalidName = 'noSpecial#';
    createMemberDto.name = invalidName;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_NAME_MESSAGE);
  });

  it('이름은 6글자 이상이어야 합니다.', async () => {
    const tooShortName = '짧';
    createMemberDto.name = tooShortName;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.minLength).toBe(INVALID_NAME_MIN_LENGTH_MESSAGE);
  });

  it('이름은 20글자 이하이어야 합니다.', async () => {
    const tooLongName = 'ThisNameIsTooLongForOurSystem';
    createMemberDto.name = tooLongName;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.maxLength).toBe(INVALID_NAME_MAX_LENGTH_MESSAGE);
  });

  it('비밀번호는 각각 최소 1개 이상의 한글,영문,숫자로 이루어져야 합니다.', async () => {
    const invalidPassword = 'noSpecial#';
    createMemberDto.password = invalidPassword;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_PASSWORD_MESSAGE);
  });

  it('비밀번호는 6글자 이상이어야 합니다.', async () => {
    const tooShortPassword = 'a1#';
    createMemberDto.password = tooShortPassword;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.minLength).toBe(INVALID_PASSWORD_MIN_LENGTH_MESSAGE);
  });

  it('비밀번호는 12글자 이하이어야 합니다.', async () => {
    const tooLongPassword = 'abcd123456789!';
    createMemberDto.password = tooLongPassword;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.maxLength).toBe(INVALID_PASSWORD_MAX_LENGTH_MESSAGE);
  });

  it('아이디는 영문,숫자로 이루어져야 합니다.', async () => {
    const invalidId = 'noSpecial#';
    createMemberDto.username = invalidId;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_ID_MESSAGE);
  });

  it('아이디는 6글자 이상이어야 합니다.', async () => {
    const tooShortId = 'a1#';
    createMemberDto.username = tooShortId;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.minLength).toBe(INVALID_ID_MIN_LENGTH_MESSAGE);
  });

  it('아이디는 12글자 이하이어야 합니다.', async () => {
    const tooLongId = 'abcd123456789!';
    createMemberDto.username = tooLongId;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.maxLength).toBe(INVALID_ID_MAX_LENGTH_MESSAGE);
  });

  it('휴대폰 번호의 공백과 - 을 제거한다.', async () => {
    const invalidMobileNumber = '010-8098- 1398';
    createMemberDto.mobileNumber = invalidMobileNumber;

    createMemberDto = plainToInstance(CreateMemberDto, createMemberDto);

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors).toHaveLength(0);
  });

  it('이메일주소는 XXXX@XXXX.XXX 형식이어야 합니다.', async () => {
    const invalidEmail = 'invalidEmailAddress';
    createMemberDto.email = invalidEmail;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_EMAIL_MESSAGE);
  });

  it('생년은 네 자리 숫자이어야 합니다.', async () => {
    const invalidBirthYear = '931117';
    createMemberDto.birthYear = invalidBirthYear;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_BIRTHYEAR_MESSAGE);
  });

  it('생일은 네 자리 숫자이어야 합니다.', async () => {
    const invalidBirthDay = '931117';
    createMemberDto.birthday = invalidBirthDay;

    const validationErrors = await validate(createMemberDto);

    expect(validationErrors[0].constraints.matches).toBe(INVALID_BIRTHDAY_MESSAGE);
  });
});
