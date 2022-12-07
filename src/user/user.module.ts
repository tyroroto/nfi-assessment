import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserEntity } from './user.entity';
import { UserService } from './service/user.service';

@Module({
  imports: [SequelizeModule.forFeature([UserEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
