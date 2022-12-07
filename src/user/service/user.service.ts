import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from '../user.entity';
import { hash } from 'argon2';
import { WalletEntity } from '../../bank/entitys/wallet.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity)
    private userModel: typeof UserEntity,
  ) {}

  async createUser(username: string, password) {
    const hashResult = await hash(password);
    const createdUser = new UserEntity();
    createdUser.username = username;
    createdUser.passwordHash = hashResult;
    await createdUser.save();
    return this.dtoUser(createdUser);
  }

  dtoUser(user: UserEntity): Partial<UserEntity> {
    const dto = Object.assign({}, user.toJSON());
    delete dto['passwordHash'];
    return dto;
  }

  async findUserById(id: number) {
    return this.userModel.findOne({ where: { id }, include: [WalletEntity] });
  }

  async findUser(username: string) {
    return this.userModel.findOne({ where: { username } });
  }

  async updatePassword(id: number, password: string) {
    const hashResult = await hash(password);
    const user = await this.userModel.findByPk(id);
    user.passwordHash = hashResult;
    await user.save();
  }
}
