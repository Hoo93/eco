import { PickType } from '@nestjs/swagger';
import { CreateMemberDto } from '../../auth/member/dto/create-member.dto';

export class UpdateMemberDto extends PickType(CreateMemberDto, ['birthday', 'birthYear', 'email', 'nickname']) {}
