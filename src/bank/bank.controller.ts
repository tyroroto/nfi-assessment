import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BankService } from './bank.service';

@Controller('bank')
export class BankController {
  constructor(private bankService: BankService) {}

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getCacheBalance(@Request() req) {
    return { balance: req.user.wallet.balance, userId: req.user.id };
  }
  @UseGuards(JwtAuthGuard)
  @Get('balance/:id')
  async getCacheBalanceByID(@Request() req, @Param('id') uid) {
    return { balance: await this.bankService.getCacheBalance(parseInt(uid)) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('re-sum-balance')
  async getBalance(@Request() req) {
    const balance = await this.bankService.sumBalance(req.wallet.id);
    return { balance: balance, userId: req.user.id };
  }

  @Get('transaction/:id')
  async getFormDraft(@Request() req, @Param('id') tranId) {
    return await this.bankService.getTransaction(tranId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  async Withdraw(
    @Request() req,
    @Body()
    body: {
      value: number;
    },
  ) {
    const { balance, transaction } = await this.bankService.withdraw(
      req.user,
      body.value,
    );
    return {
      balance: balance,
      userId: req.user.id,
      transactionId: transaction.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async Deposit(
    @Request() req,
    @Body()
    body: {
      value: number;
    },
  ) {
    const { balance, transaction } = await this.bankService.deposit(
      req.user,
      body.value,
    );
    return {
      balance: balance,
      userId: req.user.id,
      transactionId: transaction.id,
    };
  }

  @Post('register')
  async Register(
    @Request() req,
    @Body()
    body: {
      username: string;
      password: string;
    },
  ) {
    return await this.bankService.register(body.username, body.password);
  }
}
