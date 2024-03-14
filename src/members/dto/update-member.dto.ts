import { PartialType } from '@nestjs/swagger';
import { CreateMemberDto } from '../../auth/member/dto/create-member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}
