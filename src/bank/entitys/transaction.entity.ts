import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  DataType,
  Index,
} from 'sequelize-typescript';
import { WalletEntity } from './wallet.entity';

@Table({
  timestamps: true,
  paranoid: true,
  updatedAt: false,
})
export class TransactionEntity extends Model {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Index('transaction_walletid_index')
  @ForeignKey(() => WalletEntity)
  @Column
  walletId: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  debit: number;

  @Column({
    defaultValue: 0,
    type: DataType.DOUBLE,
  })
  credit: number;
}
