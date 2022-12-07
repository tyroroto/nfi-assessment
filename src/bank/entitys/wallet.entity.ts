import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
  Unique,
  BelongsTo,
  NotNull,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { UserEntity } from '../../user/user.entity';

@Table({
  timestamps: true,
  paranoid: true,
})
export class WalletEntity extends Model {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => UserEntity)
  @Column({
    allowNull: false,
    unique: true,
  })
  userId: number;

  @Column({ type: DataType.DOUBLE })
  balance: number;

  @BelongsTo(() => UserEntity)
  owner: UserEntity;
}
