// ============================================================
// ----- Kiểu dữ liệu cho sẵn -----
// Đúng: PaymentChannel union type đúng 3 giá trị.
type PaymentChannel = "card" | "bank" | "wallet";
// Đúng: PaymentStatus union type đúng 2 giá trị.
type PaymentStatus = "paid" | "failed";

// Đúng: IPaymentRequest mô tả đầy đủ field theo đề.
interface IPaymentRequest {
  id: string;
  customer: string;
  amount: number;
  channel: PaymentChannel;
}

// Đúng: IPaymentResult mô tả object trả về.
interface IPaymentResult {
  id: string;
  provider: string;
  status: PaymentStatus;
  fee: number;
  totalCharged: number;
  message: string;
}

// Đúng: ILogger là contract cho logger.
interface ILogger {
  log(message: string): void;
}

// Đúng: MemoryLogger implements ILogger.
// Đúng: logs là private field, getLogs trả về bản copy bằng spread.
class MemoryLogger implements ILogger {
  private logs: string[] = [];

  log(message: string): void {
    this.logs.push(message);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}

// Đúng: abstract class PaymentGateway.
// Đúng: protected providerName, getter name, 2 abstract method.
abstract class PaymentGateway {
  protected providerName: string;

  constructor(providerName: string) {
    this.providerName = providerName;
  }

  get name(): string {
    return this.providerName;
  }

  // Đúng: abstract method.
  abstract supports(channel: PaymentChannel): boolean;
  abstract calculateFee(amount: number): number;

  // Đúng: pay validate amount và supports trước khi tính fee.
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

// Đúng: CardGateway extend PaymentGateway.
class CardGateway extends PaymentGateway {
  constructor() {
    super("Neko Card");
  }

  supports(channel: PaymentChannel): boolean {
    return channel === "card";
  }

  // Đúng: Math.max(amount * 0.02, 5000) đảm bảo phí tối thiểu 5000.
  calculateFee(amount: number): number {
    return Math.max(amount * 0.02, 5000);
  }
}

// Đúng: BankGateway tính phí đúng theo mốc 10.000.000.
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

// Đúng: WalletGateway dùng Math.min để giới hạn phí tối đa 20.000.
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

// Đúng: PaymentProcessor nhận gateways và logger qua constructor (composition + DI).
// Đúng: gateways và logger là private field.
class PaymentProcessor {
  constructor(
    private gateways: PaymentGateway[],
    private logger: ILogger,
  ) {}

  // Đúng: find gateway hỗ trợ channel, nếu không có thì trả failed.
  // Đúng: try/catch bắt lỗi từ gateway.pay.
  // Đúng: error instanceof Error để an toàn hơn err: any, có fallback "Unknown error".
  process(request: IPaymentRequest): IPaymentResult {
    const gateway = this.gateways.find((item) =>
      item.supports(request.channel),
    );

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

  // Đúng: processMany dùng for...of xử lý từng request.
  processMany(requests: IPaymentRequest[]): IPaymentResult[] {
    const results: IPaymentResult[] = [];

    for (const request of requests) {
      results.push(this.process(request));
    }

    return results;
  }

  // Đúng: getPaidTotal dùng for...of cộng dồn totalCharged cho result paid.
  getPaidTotal(results: IPaymentResult[]): number {
    let total = 0;

    for (const result of results) {
      if (result.status === "paid") {
        total += result.totalCharged;
      }
    }

    return total;
  }

  // Đúng: getFailedMessages dùng for...of lọc failed rồi push message.
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

// ============================================================
// TỔNG HỢP REVIEW — BÀI 1
// ============================================================
// Kết quả: ĐẠT, output khớp 100% các case theo đề.
//
// Điểm tốt:
//   - Dùng đúng abstract class PaymentGateway với 2 abstract method.
//   - 3 class con CardGateway / BankGateway / WalletGateway đều đúng logic phí và channel.
//   - PaymentProcessor nhận dependencies qua constructor (composition + DI).
//   - process bắt lỗi bằng try/catch và có check instanceof Error -> an toàn hơn err: any.
//   - processMany dùng for...of.
//   - getPaidTotal và getFailedMessages đúng yêu cầu.
//   - MemoryLogger có private logs và getLogs trả bản copy.
//
