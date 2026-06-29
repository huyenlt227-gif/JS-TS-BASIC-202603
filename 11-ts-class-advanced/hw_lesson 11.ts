type PaymentChannel = "card" | "bank" | "wallet";
type PaymentStatus = "paid" | "failed";

interface IPaymentRequest {
  id: string;
  customer: string;
  amount: number;
  channel: PaymentChannel;
}

interface IPaymentResult {
  id: string;
  provider: string;
  status: PaymentStatus;
  fee: number;
  totalCharged: number;
  message: string;
}

interface ILogger {
  log(message: string): void;
}

class MemoryLogger implements ILogger {
  private logs: string[] = [];

  log(message: string): void {
    this.logs.push(message);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}

abstract class PaymentGateway {
  protected providerName: string;

  constructor(providerName: string) {
    this.providerName = providerName;
  }

  get name(): string {
    return this.providerName;
  }

  abstract supports(channel: PaymentChannel): boolean;

  abstract calculateFee(amount: number): number;

  pay(request: IPaymentRequest): IPaymentResult {
    if (request.amount <= 0) {
      throw new Error("Số tiền phải lớn hơn 0");
    }

    if (!this.supports(request.channel)) {
      throw new Error("Gateway không hỗ trợ kênh thanh toán");
    }

    const fee = this.calculateFee(request.amount);

    return {
      id: request.id,
      provider: this.name,
      status: "paid",
      fee,
      totalCharged: request.amount + fee,
      message: `Thanh toán thành công cho ${request.customer}`,
    };
  }
}

class CardGateway extends PaymentGateway {
  constructor() {
    super("Neko Card");
  }

  supports(channel: PaymentChannel): boolean {
    return channel === "card";
  }

  calculateFee(amount: number): number {
    return Math.max(amount * 0.02, 5000);
  }
}

class BankGateway extends PaymentGateway {
  constructor() {
    super("Neko Bank");
  }

  supports(channel: PaymentChannel): boolean {
    return channel === "bank";
  }

  calculateFee(amount: number): number {
    if (amount >= 10000000) {
      return 0;
    }

    return 10000;
  }
}

class WalletGateway extends PaymentGateway {
  constructor() {
    super("Neko Wallet");
  }

  supports(channel: PaymentChannel): boolean {
    return channel === "wallet";
  }

  calculateFee(amount: number): number {
    return Math.min(amount * 0.01, 20000);
  }
}

class PaymentProcessor {
  constructor(
    private gateways: PaymentGateway[],
    private logger: ILogger,
  ) {}

  process(request: IPaymentRequest): IPaymentResult {
    const gateway = this.gateways.find((item) => item.supports(request.channel));

    if (!gateway) {
      const result: IPaymentResult = {
        id: request.id,
        provider: "",
        status: "failed",
        fee: 0,
        totalCharged: 0,
        message: "Không tìm thấy gateway phù hợp",
      };

      this.logger.log(`[FAILED] ${request.id}: ${result.message}`);
      return result;
    }

    try {
      const result = gateway.pay(request);
      this.logger.log(`[PAID] ${request.id} by ${result.provider}`);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.log(`[FAILED] ${request.id}: ${message}`);

      return {
        id: request.id,
        provider: gateway.name,
        status: "failed",
        fee: 0,
        totalCharged: 0,
        message,
      };
    }
  }

  processMany(requests: IPaymentRequest[]): IPaymentResult[] {
    const results: IPaymentResult[] = [];

    for (const request of requests) {
      results.push(this.process(request));
    }

    return results;
  }

  getPaidTotal(results: IPaymentResult[]): number {
    let total = 0;

    for (const result of results) {
      if (result.status === "paid") {
        total += result.totalCharged;
      }
    }

    return total;
  }

  getFailedMessages(results: IPaymentResult[]): string[] {
    const failedMessages: string[] = [];

    for (const result of results) {
      if (result.status === "failed") {
        failedMessages.push(`${result.id}: ${result.message}`);
      }
    }

    return failedMessages;
  }
}

const logger = new MemoryLogger();
const processor = new PaymentProcessor(
  [new CardGateway(), new BankGateway(), new WalletGateway()],
  logger,
);

const requests: IPaymentRequest[] = [
  { id: "o1", customer: "An", amount: 500000, channel: "card" },
  { id: "o2", customer: "Bình", amount: 12000000, channel: "bank" },
  { id: "o3", customer: "Cường", amount: 2500000, channel: "wallet" },
  { id: "o4", customer: "Dung", amount: -100000, channel: "card" },
];

const results = processor.processMany(requests);

console.log(
  results.map(
    (result) =>
      `${result.id}:${result.provider}:${result.status}:${result.fee}:${result.totalCharged}`,
  ),
);
console.log(processor.getPaidTotal(results));
console.log(processor.getFailedMessages(results));
console.log(logger.getLogs().length);