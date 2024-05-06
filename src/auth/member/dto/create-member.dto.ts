import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Member } from '../../../members/entities/member.entity';
import { MemberType } from '../../const/member-type.enum';
import { CreateAuthDto } from '../../dto/create-auth.dto';
import {
  INVALID_BIRTHDAY_MESSAGE,
  INVALID_BIRTHYEAR_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  INVALID_MOBILENUMBER_MESSAGE,
  INVALID_NICKNAME_MAX_LENGTH_MESSAGE,
  INVALID_NICKNAME_MIN_LENGTH_MESSAGE,
} from '../../const/error-message';
import { MobileNumberTransform } from '../../../common/decorator/phoneNumber.decorator';

export class CreateMemberDto extends CreateAuthDto {
  @IsEnum(MemberType)
  @ApiProperty({
    description: '회원 타입',
    type: 'enum',
    enum: MemberType,
    example: MemberType.GENERAL,
  })
  type: MemberType;

  @IsString()
  @MinLength(2, { message: INVALID_NICKNAME_MIN_LENGTH_MESSAGE })
  @MaxLength(10, { message: INVALID_NICKNAME_MAX_LENGTH_MESSAGE })
  @ApiProperty({
    description: '회원 닉네임',
    type: 'string',
    example: '불꽃방귀어피치',
  })
  nickname: string;

  @IsString()
  @Matches(/^01[01]{1}\d{7,8}$/, {
    message: INVALID_MOBILENUMBER_MESSAGE,
  })
  @MobileNumberTransform()
  @ApiProperty({
    description: '회원 전화번호',
    type: 'string',
    example: '01012345678',
  })
  mobileNumber: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  @Matches(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, {
    message: INVALID_EMAIL_MESSAGE,
  })
  @ApiPropertyOptional({
    description: '회원 이메일',
    type: 'string',
    example: 'daum@naver.com',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{4}$/, {
    message: INVALID_BIRTHYEAR_MESSAGE,
  })
  @ApiPropertyOptional({
    description: '회원 생년',
    type: 'string',
    example: '1993',
  })
  birthYear?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{4}$/, {
    message: INVALID_BIRTHDAY_MESSAGE,
  })
  @ApiPropertyOptional({
    description: '회원 생일',
    type: 'string',
    example: '1117',
  })
  birthday?: string;

  public toEntity(createdAt = new Date()) {
    const member = new Member();
    member.type = this.type;
    member.username = this.username;
    member.password = this.password;
    member.name = this.name;
    member.nickname = this.nickname;
    member.mobileNumber = this.mobileNumber;
    member.email = this?.email || null;
    member.birthday = this?.birthday || null;
    member.createId = this.username;
    member.createdAt = createdAt;
    return member;
  }
}
