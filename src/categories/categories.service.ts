import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CategoryClosure } from './entities/cattegory-closure.entity';
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

    try {
      const category = createCategoryDto.toEntity();
      category.createId = 'test';
      await this.categoryRepository.save(category);

      if (createCategoryDto.parentId) {
        await this.isValidCategoryId(createCategoryDto.parentId);
      }

      const manager = queryRunner.manager;

      // 자기 자신이 ancestor이자 descendant인 closure 생성
      const ancestorId = category.id;
      const newClosure = this.categoryClosureRepository.create({
        ancestorId: category.id,
        descendantId: category.id,
        depth: 0,
      });
      await manager.save(newClosure);

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

  private async isValidCategoryId(id: number) {
    const found = await this.categoryRepository.findOneBy({ id });
    if (!found) {
      throw new Error('부모 카테고리가 존재하지 않습니다.');
    }
    return;
  }
}
