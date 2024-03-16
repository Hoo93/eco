import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import {
  INVALID_ID_MAX_LENGTH_MESSAGE,
  INVALID_ID_MESSAGE,
  INVALID_ID_MIN_LENGTH_MESSAGE,
  INVALID_NAME_MAX_LENGTH_MESSAGE,
  INVALID_NAME_MESSAGE,
  INVALID_NAME_MIN_LENGTH_MESSAGE,
  INVALID_PASSWORD_MAX_LENGTH_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  INVALID_PASSWORD_MIN_LENGTH_MESSAGE,
} from '../const/error-message';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @IsString()
  @MinLength(6, { message: INVALID_ID_MIN_LENGTH_MESSAGE })
  @MaxLength(12, { message: INVALID_ID_MAX_LENGTH_MESSAGE })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: INVALID_ID_MESSAGE,
  })
  @ApiProperty({
    description: '회원 아이디',
    type: 'string',
    example: 'dkandkdlel',
  })
  username: string;

  @IsString()
  @MinLength(6, { message: INVALID_PASSWORD_MIN_LENGTH_MESSAGE })
  @MaxLength(12, { message: INVALID_PASSWORD_MAX_LENGTH_MESSAGE })
  @Matches(/^(?=.*?[a-zA-Z])(?=.*?\d)(?=.*?[!@#$%^&*]).{6,13}$/, {
    message: INVALID_PASSWORD_MESSAGE,
  })
  @ApiProperty({
    description: '회원 비밀번호',
    type: 'string',
    example: 'test123123!!',
  })
  password: string;

  @IsString()
  @MinLength(2, { message: INVALID_NAME_MIN_LENGTH_MESSAGE })
  @MaxLength(20, { message: INVALID_NAME_MAX_LENGTH_MESSAGE })
  @Matches(/^[가-힣a-zA-Z0-9]+$/, {
    message: INVALID_NAME_MESSAGE,
  })
  @ApiProperty({ description: '회원 이름', type: 'string', example: '이승형' })
  name: string;
}
