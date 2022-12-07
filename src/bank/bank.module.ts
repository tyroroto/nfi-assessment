import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionEntity } from './entitys/transaction.entity';
import { WalletEntity } from './entitys/wallet.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    SequelizeModule.forFeature([TransactionEntity, WalletEntity]),
  ],
  providers: [BankService],
  controllers: [BankController],
})
export class BankModule {}
