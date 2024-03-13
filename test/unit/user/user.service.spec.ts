import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/users/entities/user.entity';
import { MockUserRepository } from './mockUserRepository';
import { Test, TestingModule } from '@nestjs/testing';
import { MockJwtService } from './mockJwtService';
import { UsersService } from '../../../src/users/users.service';
import { Pagination } from '../../../src/common/pagination';

describe('UserService Test', function () {
  let service: UsersService;
  let userRepository: MockUserRepository;
  let jwtService: MockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockUserRepository>(getRepositoryToken(User));
  });

  it('usersService should be defined', function () {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('findOneByMobileNumber should returns exact user', async () => {
    const mobileNumber = '010-1234-1398';

    const user = await service.findOneByMobileNumber(mobileNumber);

    expect(user.mobileNumber).toBe('01012341398');
  });

  it('findOneByMobileNumber should returns exact user', async () => {
    const id = 'TEST_1';

    const user = await service.findOneById(id);

    expect(user.id).toBe(id);
  });

  it('findAll returns all users', async () => {
    const pagination = new TestingPagination();
    pagination.pageNo = 1;
    pagination.pageSize = 2;

    const result = await service.findAll(pagination);

    expect(result.count).toBe(3);
    expect(result.list.length).toBe(2);
  });
});
class TestingPagination extends Pagination {}
