import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { TransactionEntity } from './entitys/transaction.entity';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { QueryTypes, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { WalletEntity } from './entitys/wallet.entity';
import { UserService } from '../user/service/user.service';

@Injectable()
export class BankService {
  constructor(
    private sequelize: Sequelize,
    private userService: UserService,
    @InjectModel(WalletEntity)
    public walletModel: typeof WalletEntity,
  ) {}

  async deposit(
    user: UserEntity,
    debit: number,
  ): Promise<{ transaction: TransactionEntity; balance: number }> {
    if (debit <= 0) {
      throw new Error('Deposit should more than 0');
    }
    const t = await this.sequelize.transaction();
    let wallet: WalletEntity;
    let trans: TransactionEntity;
    try {
      wallet = await this.walletModel.findByPk(user.wallet.id, {
        transaction: t,
      });
      trans = new TransactionEntity();
      trans.debit = debit;
      trans.walletId = user.wallet.id;
      await trans.save({ transaction: t });
    } catch (e) {
      await t.rollback();
      throw e;
    }
    await t.commit();
    const balance = (wallet.balance += debit);
    await this.sumBalance(user.wallet.id);
    return { transaction: trans, balance };
  }

  async withdraw(
    user: UserEntity,
    credit: number,
  ): Promise<{ transaction: TransactionEntity; balance: number }> {
    if (credit <= 0) {
      throw new Error('Withdraw should more than 0');
    }

    const t = await this.sequelize.transaction();
    let wallet: WalletEntity;
    let trans: TransactionEntity;
    try {
      const currentBalance = await this.sumBalance(user.wallet.id, t);
      wallet = await this.walletModel.findByPk(user.wallet.id, {
        transaction: t,
      });
      if (currentBalance < credit) {
        throw new HttpException('Balance not enough.', 500);
      }
      trans = new TransactionEntity();
      trans.credit = credit;
      trans.walletId = user.wallet.id;
      await trans.save({ transaction: t });
    } catch (e) {
      await t.rollback();
      throw e;
    }
    await t.commit();
    const balance = (wallet.balance -= credit);
    await this.sumBalance(user.wallet.id);
    return { transaction: trans, balance };
  }

  async sumBalance(walletId, t?: Transaction): Promise<number> {
    await this.sequelize.query(
      `UPDATE WalletEntities
                INNER JOIN
                (SELECT SUM(debit) as s_debit , SUM(credit) as s_credit
                 FROM TransactionEntities
                 WHERE walletId = :walletId1
                   and deletedAt IS NULL) sumTable
             SET balance = (sumTable.s_debit) - (sumTable.s_credit)
             WHERE WalletEntities.id = :walletId2;`,
      {
        replacements: { walletId1: walletId, walletId2: walletId },
        type: QueryTypes.UPDATE,
        transaction: t,
      },
    );
    const wallet = await WalletEntity.findByPk(walletId);
    return wallet.balance;
  }

  async getCacheBalance(userId: number): Promise<number> {
    const u = await this.userService.findUserById(userId);
    return u.wallet.balance;
  }

  async getTransaction(tranId): Promise<TransactionEntity> {
    const trans = await TransactionEntity.findByPk(tranId);
    if (trans == null) {
      throw new NotFoundException();
    }
    return trans;
  }

  async register(username: string, password: string) {
    const userDto = await this.userService.createUser(username, password);
    console.log(userDto);
    const wallet = new WalletEntity();
    wallet.balance = 0;
    wallet.userId = userDto.id;
    await wallet.save();
    userDto.wallet = wallet;
    return userDto;
  }
}
