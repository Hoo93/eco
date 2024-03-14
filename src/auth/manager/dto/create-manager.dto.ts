import { Member } from '../../../members/entities/member.entity';
import { CreateAuthDto } from '../../dto/create-auth.dto';

export class CreateManagerDto extends CreateAuthDto {
  public toEntity(createdAt = new Date()) {
    const member = new Member();
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
