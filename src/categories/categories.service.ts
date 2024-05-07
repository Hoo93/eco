import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private dataSource: DataSource,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = createCategoryDto.toEntity();
    category.createId = 'test';

    if (createCategoryDto.ancestorId) {
      const ancestor = await this.categoryRepository.findOneBy({ id: createCategoryDto.ancestorId });
      if (!ancestor) {
        throw new Error('부모 카테고리가 존재하지 않습니다.');
      }
      category.ancestor = ancestor;
    }

    const sameDepthCategories = await this.categoryRepository.find({
      select: { priority: true },
      where: { ancestorId: createCategoryDto.ancestorId ?? IsNull() },
      order: { priority: 'DESC' },
    });

    category.priority = sameDepthCategories[0].priority + 1;

    return this.categoryRepository.save(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new Error('존재하지 않는 카테고리입니다.');
    }

    if (updateCategoryDto.ancestorId) {
      const ancestor = await this.categoryRepository.findOneBy({ id: updateCategoryDto.ancestorId });
      if (!ancestor) {
        throw new Error('부모 카테고리가 존재하지 않습니다.');
      }
      category.ancestor = ancestor;
    }

    //   // 우선순위 검증
    let sameDepthCategories: Category[];
    if (updateCategoryDto.ancestorId) {
      sameDepthCategories = await this.categoryRepository.find({
        where: { ancestorId: updateCategoryDto.ancestorId ?? IsNull() },
        order: { priority: 'DESC' },
      });
    } else {
      // parent가 없는 경우
      sameDepthCategories = await this.getTopLevelCategories();
    }

    console.log(sameDepthCategories);

    if (!this.isValidPriority(sameDepthCategories, updateCategoryDto.priority)) {
      throw new Error('우선순위가 올바르지 않습니다.');
    }

    for (const [k, v] of Object.entries(updateCategoryDto)) {
      category[k] = v;
    }

    return this.categoryRepository.save(category);
  }

  async findAll() {
    return this.dataSource.manager.getTreeRepository(Category).findTrees();
  }

  private isValidPriority(categories: Category[], priority: number) {
    if (categories.map((cat) => cat.priority).includes(priority)) {
      return false;
    }

    if (categories.length + 1 < priority) {
      return false;
    }

    return true;
  }

  // async update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   if (!(await this.isValidCategoryId(updateCategoryDto.parentId))) {
  //     throw new BadRequestException('부모 카테고리가 존재하지 않습니다.');
  //   }
  //
  //   // 우선순위 검증
  //   let sameDepthCategories: Category[];
  //   if (updateCategoryDto.parentId) {
  //     sameDepthCategories = await this.getDirectSubcategories(updateCategoryDto.parentId);
  //   } else {
  //     // parent가 없는 경우
  //     sameDepthCategories = await this.getTopLevelCategories();
  //   }
  //
  //   if (!this.isValidPriority(sameDepthCategories, updateCategoryDto.priority)) {
  //     throw new BadRequestException('우선순위가 올바르지 않습니다.');
  //   }
  //
  //   const queryRunner = this.dataSource.createQueryRunner();
  //
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //
  //   const manager = queryRunner.manager;
  //
  //   try {
  //     await manager.update(Category, id, updateCategoryDto);
  //
  //     // 우선순위 조정
  //     const adjustCategories = sameDepthCategories.filter((c) => c.priority >= createCategoryDto.priority);
  //     const newCategories = adjustCategories.map((c) => {
  //       c.priority += 1;
  //       return c;
  //     });
  //
  //     await manager.save(newCategories);
  //
  //     // 부모의 조상 closure들을 자신의 조상으로 복사
  //     if (updateCategoryDto.parentId) {
  //       const newClosures = await this.copyAncestor(updateCategoryDto.parentId, category.id);
  //       await manager.save(newClosures);
  //     }
  //
  //     await queryRunner.commitTransaction();
  //
  //     return category;
  //   } catch (e) {
  //     await queryRunner.rollbackTransaction();
  //     throw e;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
  //
  // async findAll() {
  //   const cc = await this.categoryClosureRepository.find({
  //     where: { depth: In([0, 1]) },
  //     relations: {
  //       descendant: true,
  //     },
  //     order: {
  //       descendant: {
  //         priority: 'ASC',
  //       },
  //     },
  //   });
  //
  //   const depth0 = cc.filter((c) => c.depth === 0);
  //   const depth1 = cc.filter((c) => c.depth === 1);
  //
  //   // depth0, 1을 이용해 최상위 카테고리 조회
  //   const hierarchyCategories = depth0.filter((c) => !depth1.includes(c)).map((cc) => cc.descendant);
  //
  //   for (const category of hierarchyCategories) {
  //     category.descendants = this.buildHierarchy(category, depth1);
  //   }
  //
  //   return hierarchyCategories;
  // }
  //
  private getTopLevelCategories() {
    return this.categoryRepository
      .createQueryBuilder('c')
      .leftJoin('category_closure', 'cc', 'c.id = cc.descendantId AND c.id != cc.ancestorId')
      .where('cc.ancestorId IS NULL')
      .getMany();
  }

  //
  // private getDirectSubcategories(parentId: number) {
  //   return this.categoryRepository
  //     .createQueryBuilder('category')
  //     .innerJoin('category_closure', 'cc', 'category.id = cc.descendantId AND cc.ancestorId = :ancestorId AND cc.depth = 1', {
  //       ancestorId: parentId,
  //     })
  //     .getMany();
  // }

  // 재귀적으로 하위 카테고리를 찾아서 반환

  // CategoryClosure의 descendant를 조인해줘야 함
  // private buildHierarchy(root: Category, categoryClosures: CategoryClosure[]) {
  //   const descendants = categoryClosures.filter((c) => c.ancestorId === root.id).map((c) => c.descendant);
  //   descendants.forEach((child) => {
  //     child.descendants = this.buildHierarchy(child, categoryClosures);
  //   });
  //   return descendants;
  // }
  //
  // private async copyAncestor(parentId: number, descendantIds: number[]): Promise<CategoryClosure[]> {
  //   const ancestorClosures = await this.categoryClosureRepository.find({
  //     where: { descendant: { id: parentId } },
  //   });
  //
  //   const newClosures: CategoryClosure[] = [];
  //
  //   for (const descendantId of descendantIds) {
  //     newClosures.push(
  //       ...ancestorClosures.map((anc) =>
  //         this.categoryClosureRepository.create({
  //           ancestorId: anc.ancestorId,
  //           descendantId: descendantId,
  //           depth: anc.depth + 1,
  //         }),
  //       ),
  //     );
  //   }
  //
  //   return newClosures;
  // }

  private async isValidCategoryId(id: number) {
    const found = await this.categoryRepository.findOneBy({ id });
    return !!found;
  }
}
