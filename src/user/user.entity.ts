import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
  Unique,
  HasOne,
} from 'sequelize-typescript';
import { WalletEntity } from '../bank/entitys/wallet.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class UserEntity extends Model {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Unique
  @Column({
    unique: true,
  })
  username: string;

  @Column
  passwordHash: string;

  @HasOne(() => WalletEntity)
  wallet: WalletEntity;
}
