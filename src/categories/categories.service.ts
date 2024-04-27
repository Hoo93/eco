import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CategoryClosure } from './entities/category-closure.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryClosure)
    private categoryClosureRepository: Repository<CategoryClosure>,
    private dataSource: DataSource,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    // 트랜잭션 시작
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const manager = queryRunner.manager;

    try {
      const category = createCategoryDto.toEntity();
      // TODO 테스트 후 생성자 id 추가
      category.createId = 'test';

      if (createCategoryDto.parentId) {
        await this.isValidCategoryId(createCategoryDto.parentId);
      }

      let sameDepthCategories: Category[];
      if (createCategoryDto.parentId) {
        sameDepthCategories = await this.categoryRepository
          .createQueryBuilder('category')
          .innerJoin('category_closure', 'cc', 'category.id = cc.descendantId AND cc.ancestorId = :ancestorId AND cc.depth = 1', {
            ancestorId: createCategoryDto.parentId,
          })
          .getMany();
      } else {
        // parent가 없는 경우
        sameDepthCategories = await this.categoryRepository
          .createQueryBuilder('c')
          .leftJoin('category_closure', 'cc', 'c.id = cc.descendantId AND c.id != cc.ancestorId')
          .where('cc.ancestorId IS NULL')
          .getMany();
      }

      if (createCategoryDto.priority > sameDepthCategories.length + 1) {
        throw new BadRequestException('우선순위가 올바르지 않습니다.');
      }
      await manager.save(category);

      // 우선순위 조정
      const adjustCategories = sameDepthCategories.filter((c) => c.priority >= createCategoryDto.priority);
      const newCategories = adjustCategories.map((c) => {
        c.priority += 1;
        return c;
      });
      await manager.save(newCategories);

      // 자기 자신이 ancestor이자 descendant인 closure 생성
      const ancestorId = category.id;
      const newClosure = this.categoryClosureRepository.create({
        ancestorId: category.id,
        descendantId: category.id,
        depth: 0,
      });
      await manager.save(newClosure);

      // 부모의 조상 closure들을 자신의 조상으로 복사
      if (createCategoryDto.parentId) {
        const ancestorClosures = await this.categoryClosureRepository.find({
          where: { descendant: { id: createCategoryDto.parentId } },
        });

        const newClosures = ancestorClosures.map((anc) =>
          this.categoryClosureRepository.create({
            ancestorId: anc.ancestorId,
            descendantId: category.id,
            depth: anc.depth + 1,
          }),
        );
        await manager.save(newClosures);
      }

      await queryRunner.commitTransaction();

      return category;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  // 같은 부모를 가진 그룹 내에서 입력한 우선순위가 그룹 내의 카테고리 수와 같은지 검사
  private async isValidPriority(parentId: number, priority: number) {
    if (parentId) {
      const count = await this.categoryClosureRepository.count({
        where: { ancestorId: parentId, depth: 1 },
      });

      if (priority > count + 1) return false;
      return true;
    }
    // parent가 없는 경우
    const count = await this.categoryRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('category_closure', 'cc', 'c.id = cc.child_id AND c.id != cc.parent_id')
      .where('cc.parent_id IS NULL')
      .getCount();

    if (priority > count + 1) return false;
    return true;
  }

  private async isValidCategoryId(id: number) {
    const found = await this.categoryRepository.findOneBy({ id });
    if (!found) {
      throw new Error('부모 카테고리가 존재하지 않습니다.');
    }
    return;
  }
}
