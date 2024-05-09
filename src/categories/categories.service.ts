import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryClosure } from './entities/category-closure.entity';

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
    const category = createCategoryDto.toEntity();
    category.createId = 'test';

    if (createCategoryDto.ancestorId) {
      const ancestor = await this.categoryRepository.findOneBy({ id: createCategoryDto.ancestorId });
      if (!ancestor) {
        throw new Error('부모 카테고리가 존재하지 않습니다.');
      }
    }

    const sameDepthCategories = await this.getSameDepthCategories(createCategoryDto.ancestorId);

    category.priority = sameDepthCategories.length + 1;

    const ancestorClosures = createCategoryDto.ancestorId
      ? await this.categoryClosureRepository.find({
          where: { descendantId: createCategoryDto.ancestorId },
        })
      : [];

    // Transaction Start
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const manager = queryRunner.manager;

    try {
      const createdCategory = await manager.save(category);

      const newClosures = ancestorClosures.map((anc) =>
        this.categoryClosureRepository.create({
          ancestorId: anc.ancestorId,
          descendantId: createdCategory.id,
          depth: anc.depth + 1,
        }),
      );

      const selfClosure = this.categoryClosureRepository.create({
        ancestorId: createdCategory.id,
        descendantId: createdCategory.id,
        depth: 0,
      });

      newClosures.push(selfClosure);

      await manager.save(newClosures);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return this.categoryRepository.save(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new Error('존재하지 않는 카테고리입니다.');
    }

    // if (updateCategoryDto.ancestorId) {
    //   const ancestor = await this.categoryRepository.findOneBy({ id: updateCategoryDto.ancestorId });
    //   if (!ancestor) {
    //     throw new Error('부모 카테고리가 존재하지 않습니다.');
    //   }
    //   category.ancestor = ancestor;
    // }

    // 우선순위 검증
    let sameDepthCategories: Category[] = await this.getSameDepthCategories(updateCategoryDto.ancestorId);

    if (updateCategoryDto.priority) {
      if (updateCategoryDto.ancestorId) {
        if (sameDepthCategories.length + 1 < updateCategoryDto.priority) {
          throw new Error('우선순위가 올바르지 않습니다.');
        }

        const adjustCategories = sameDepthCategories.filter((c) => c.priority >= updateCategoryDto.priority);

        for (const c of adjustCategories) {
          c.priority += 1;
        }

        await this.categoryRepository.save(adjustCategories);
      } else {
        // 부모 변경 없이 우선 순위만 변경하는 경우
        if (sameDepthCategories.length < updateCategoryDto.priority) {
          throw new Error('우선순위가 올바르지 않습니다.');
        }

        // 변경 전 보다 변경 후의 우선순위 값이 큰 경우
        if (updateCategoryDto.priority > category.priority) {
          const adjustCategories = sameDepthCategories.filter(
            (c) => c.priority > category.priority && c.priority <= updateCategoryDto.priority,
          );

          adjustCategories.forEach((c) => (c.priority -= 1));

          await this.categoryRepository.save(adjustCategories);
        } else {
          // 변경 전 보다 변경 후의 우선순위 값이 작은 경우
          const adjustCategories = sameDepthCategories.filter(
            (c) => c.priority < category.priority && c.priority >= updateCategoryDto.priority,
          );

          adjustCategories.forEach((c) => (c.priority += 1));

          await this.categoryRepository.save(adjustCategories);
        }
      }
    }

    for (const [k, v] of Object.entries(updateCategoryDto)) {
      category[k] = v;
    }

    return this.categoryRepository.save(category);
  }

  //
  async findAll() {
    const cc = await this.categoryClosureRepository.find({
      where: {
        depth: In([0, 1]),
      },
      relations: {
        descendant: true,
      },
      order: {
        descendant: {
          priority: 'ASC',
        },
      },
    });

    const hierarchyCategories = cc.filter((c) => !c.descendant?.ancestorId).map((c) => c.descendant);
    const depth1 = cc.filter((c) => !!c.descendant?.ancestorId && c.depth === 1);

    for (const category of hierarchyCategories) {
      category.descendants = this.buildHierarchy(category, depth1);
    }

    return hierarchyCategories;
  }

  private async getSameDepthCategories(ancestorId: number | null) {
    return await this.categoryRepository.find({
      where: { ancestorId: ancestorId ?? IsNull() },
      order: { priority: 'ASC' },
    });
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

  private isValidPriority(categories: Category[], priority: number) {
    if (categories.length + 1 < priority) {
      return false;
    }

    return true;
  }

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
  private buildHierarchy(root: Category, categoryClosures: CategoryClosure[]) {
    console.log(root);
    const descendants = categoryClosures.filter((c) => c.ancestorId === root.id).map((c) => c.descendant);
    descendants.forEach((child) => {
      child.descendants = this.buildHierarchy(child, categoryClosures);
    });
    return descendants;
  }

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
