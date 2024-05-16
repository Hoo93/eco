import { AuthModule } from './auth/auth.module';
import { getOrmConfig } from './common/const/orm.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from './members/members.module';
import { ManagersModule } from './managers/managers.module';
import { Member } from './members/entities/member.entity';
import { Manager } from './managers/entities/manager.entity';
import { MemberLoginHistory } from './auth/member/entity/login-history.entity';
import { SmsModule } from './sms/sms.module';
import { VerificationsModule } from './verifications/verifications.module';
import { Verification } from './verifications/entities/verification.entity';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { ApiModule } from './API-document/api.module';
import { CategoryClosure } from './categories/entities/category-closure.entity';
import { FileManagerModule } from './file-manager/file-manager.module';
import { BrandsModule } from './brands/brands.module';
import { BrandImage } from './brands/entities/brand-image.entity';
import { Brand } from './brands/entities/brand.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      ...getOrmConfig(),
      entities: [Member, Manager, MemberLoginHistory, Verification, Category, CategoryClosure, Brand, BrandImage],
    }),
    AuthModule,
    MembersModule,
    ManagersModule,
    SmsModule,
    VerificationsModule,
    ProductsModule,
    CategoriesModule,
    ApiModule,
    FileManagerModule,
    BrandsModule,
  ],
})
export class AppModule {}
