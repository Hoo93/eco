import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../../../members/entities/member.entity';
import { MemberType } from '../../const/member-type.enum';
import { CreateAuthDto } from '../../dto/create-auth.dto';

export class CreateMemberDto extends CreateAuthDto {
  @IsEnum(MemberType)
  @ApiProperty({
    description: '회원 타입',
    type: 'enum',
    enum: MemberType,
    example: MemberType.GENERAL,
  })
  type: MemberType;

  public toEntity(createdAt = new Date()) {
    const member = new Member();
    member.type = this.type;
    member.username = this.username;
    member.password = this.password;
    member.name = this.name;
    member.mobileNumber = this.mobileNumber;
    member.email = this?.email || null;
    member.birthday = this?.birthday || null;
    member.createId = this.username;
    member.createdAt = createdAt;
    return member;
  }
}
