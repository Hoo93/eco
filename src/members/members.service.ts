import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from '../auth/member/dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CommonResponseDto } from '../common/response/command-response.dto';
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

  async findOneById(id: string): Promise<CommonResponseDto<Member>> {
    const member = await this.memberRepository.findOneBy({ id });
    delete member.password;
    return new CommonResponseDto('회원 조회에 성공했습니다.', member);
  }

  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<CommonResponseDto<null>> {
    await this.memberRepository.update(id, updateMemberDto);
    return new CommonResponseDto('회원 수정이 완료되었습니다.');
  }

  async softDelete(id: string, userId: string) {
    if (id !== userId) {
      throw new BadRequestException('본인의 아이디만 삭제 가능합니다.');
    }

    await this.memberRepository.softDelete({ id });

    return new CommonResponseDto('SUCCESS DELETE MEMBER');
  }
}
