import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from '../auth/member/dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CommandResponseDto } from '../common/response/command-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(@InjectRepository(Member) private memberRepository: Repository<Member>) {}

  create(createMemberDto: CreateMemberDto) {
    return 'This action adds a new member';
  }

  findAll() {
    return `This action returns all members`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  async softDelete(id: string, userId: string) {
    if (id !== userId) {
      throw new BadRequestException('본인의 아이디만 삭제 가능합니다.');
    }

    await this.memberRepository.softDelete({ id });

    return new CommandResponseDto('SUCCESS DELETE MEMBER');
  }
}
