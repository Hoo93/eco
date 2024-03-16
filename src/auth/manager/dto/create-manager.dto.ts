import { CreateAuthDto } from '../../dto/create-auth.dto';
import { Manager } from '../../../managers/entities/manager.entity';

export class CreateManagerDto extends CreateAuthDto {
  public toEntity(createdAt = new Date()) {
    const manager = new Manager();
    manager.username = this.username;
    manager.password = this.password;
    manager.name = this.name;
    manager.createId = this.username;
    manager.createdAt = createdAt;
    return manager;
  }
}
