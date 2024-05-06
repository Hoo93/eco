import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DataSource, In, Repository } from 'typeorm';
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
        const newClosures = await this.copyAncestor(createCategoryDto.parentId, category.id);
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

  async findAll() {
    const cc = await this.categoryClosureRepository.find({
      where: { depth: In([0, 1]) },
      relations: {
        descendant: true,
      },
      order: {
        descendant: {
          priority: 'ASC',
        },
      },
    });

    const depth0 = cc.filter((c) => c.depth === 0);
    const depth1 = cc.filter((c) => c.depth === 1);

    const hierarchyCategories = depth0.filter((c) => !depth1.includes(c)).map((cc) => cc.descendant);

    for (const category of hierarchyCategories) {
      category.descendants = buildHierarchy(category, depth1);
    }

    function buildHierarchy(root: Category, categoryClosures: CategoryClosure[]) {
      const descendants = categoryClosures.filter((c) => c.ancestorId === root.id).map((c) => c.descendant);
      descendants.forEach((child) => {
        child.descendants = buildHierarchy(child, categoryClosures);
      });
      return descendants;
    }

    return hierarchyCategories;
  }

  async findAll2() {
    /**
         const categories = await this.categoryRepository.find({ order: { priority: 'ASC' } });

         const categoryClosures = await this.categoryClosureRepository.find({ where: { depth: 1 } });

         const hierarchyCategories = categories.filter((c) => categoryClosures.filter((cc) => cc.descendantId === c.id).length === 0);

         hierarchyCategories.forEach((c) => {
         c.descendants = findDescendants(c.id);
         });


         function findDescendants(ancestorId: number) {
         const descendants = categories.filter((c) =>
         categoryClosures
         .filter((cc) => cc.ancestorId === ancestorId && cc.depth === 1)
         .map((cc) => cc.descendantId)
         .includes(c.id),
         );

         if (descendants.length > 0) {
         descendants.forEach((d) => {
         d.descendants = findDescendants(d.id);
         });


         return descendants;
         }


         return hierarchyCategories;

         **/
  }

  private buildHierarchy2(root: Category, categories: Category[]): Category[] {
    // const children = categories.filter((c) => c.parent === root);
    // children.forEach((child) => {
    //   child.descendants = this.buildHierarchy(child, categories);
    // });
    // return children;
    return;
  }

  private async copyAncestor(parentId: number, descendantId: number): Promise<CategoryClosure[]> {
    const ancestorClosures = await this.categoryClosureRepository.find({
      where: { descendant: { id: parentId } },
    });

    const newClosures = ancestorClosures.map((anc) =>
      this.categoryClosureRepository.create({
        ancestorId: anc.ancestorId,
        descendantId: descendantId,
        depth: anc.depth + 1,
      }),
    );

    return newClosures;
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
