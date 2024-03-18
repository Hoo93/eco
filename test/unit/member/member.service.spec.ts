import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TestModule } from '../../../src/test.module';
import { BadRequestException } from '@nestjs/common';
import { Member } from '../../../src/members/entities/member.entity';
import { MemberType } from '../../../src/auth/const/member-type.enum';
import { MembersService } from '../../../src/members/members.service';

describe('MemberService Test', () => {
  let module: TestingModule;
  let service: MembersService;
  let memberRepository: Repository<Member>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule, TypeOrmModule.forFeature([Member])],
      providers: [MembersService],
    }).compile();

    service = module.get<MembersService>(MembersService);
    memberRepository = module.get(getRepositoryToken(Member));
  });

  beforeEach(async () => {
    await setupTest();
  });

  afterEach(async () => {
    // Delete tables after each test
    await clear();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('softDelete method test', () => {
    it('입력한 id의 데이터를 softDelete 한다.', async () => {
      // Given
      const member = createSimpleGeneralMember('test_id_1', 'pwd123!@#', '박상후', '01080981398');

      const createResult = await memberRepository.insert(member);

      const memberId = createResult.identifiers[0].id;

      // When
      const sut = await service.softDelete(memberId, memberId);

      // Then
      expect(sut.success).toBe(true);
      expect(sut.message).toBe('SUCCESS DELETE MEMBER');
    });

    it('soft delete한 id는 조회되지 않는다.', async () => {
      // Given
      const member = createSimpleGeneralMember('test_id_1', 'pwd123!@#', '박상후', '01080981398');

      const createResult = await memberRepository.insert(member);

      const memberId = createResult.identifiers[0].id;

      // When
      await service.softDelete(memberId, memberId);
      const sut = await memberRepository.findOneBy({ id: memberId });

      // Then
      expect(sut).toBe(null);
    });

    it('로그인한 회원의 id가 아닌 경우 BadRequest 에러를 발생시킨다..', async () => {
      // Given
      const member = createSimpleGeneralMember('test_id_1', 'pwd123!@#', '박상후', '01080981398');

      const createResult = await memberRepository.insert(member);

      const memberId = createResult.identifiers[0].id;

      const loginId = 'invalidId';

      // When , Then
      await expect(async () => await service.softDelete(memberId, loginId)).rejects.toThrow(
        new BadRequestException('본인의 아이디만 삭제 가능합니다.'),
      );
    });
  });

  async function setupTest() {}

  async function clear() {
    jest.restoreAllMocks(); // 각 테스트가 종료될 때 마다 jest의 모든 모의를 초기화
    await memberRepository.query('DELETE FROM member;');
  }
});

function createSimpleGeneralMember(username: string, password: string, name: string, mobileNumber: string) {
  const member = new Member();
  member.type = MemberType.GENERAL;
  member.username = username;
  member.password = password;
  member.name = name;
  member.mobileNumber = mobileNumber;
  member.createId = username;
  return member;
}
