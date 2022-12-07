import { Test, TestingModule } from '@nestjs/testing';
import { BankService } from './bank.service';

jest.mock('./bank.service'); // this happens automatically with automocking

describe('BankService', () => {
  let service: BankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankService],
    }).compile();

    service = module.get<BankService>(BankService);
  });
});
