import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Pagination } from '../common/pagination';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findAll(pagination: Pagination) {
    const [list, count] = await this.userRepository.findAndCount({
      skip: pagination.getOffset(),
      take: pagination.getLimit(),
    });

    return {
      list: list,
      count: count,
    };
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByMobileNumber(mobileNumber: string) {
    mobileNumber = mobileNumber.replaceAll('-', '');

    const { id, username, ...found } = await this.userRepository.findOne({
      where: { mobileNumber: mobileNumber },
    });

    const user = new User();
    user.id = id;
    user.username = username;
    user.mobileNumber = mobileNumber;
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
