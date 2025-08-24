import type { PaymentMethod } from '@/domains/payment/PaymentMethod';

export class CashPayment implements PaymentMethod {
  readonly type = 'cash' as const;
  private accepted = new Set([100, 500, 1000, 5000, 10000]);
  private inserted = 0;

  /** 현금은 세션 시작 시 잔액을 유지(별도 초기화 없음) */
  async start(): Promise<void> {
    /* no-op */
  }
  getBalance(): number {
    return this.inserted;
  }

  insert(denomination: number): void {
    if (!this.accepted.has(denomination)) throw new Error(`지원하지 않는 금액: ${denomination}`);
    this.inserted += denomination;
  }

  /** 결제: 요구 금액 차감, 잔액은 유지하여 이후 결제에 재사용 */
  async pay(amount: number) {
    if (this.inserted < amount) return { ok: false, error: '투입 금액이 부족합니다.' };
    this.inserted -= amount;
    return { ok: true };
  }

  /** 취소: 자동 환불하지 않음(잔액 유지) */
  async cancel(): Promise<void> {
    /* no-op */
  }

  /** 잔액 반환: 전체 잔액을 반환하고 0으로 초기화 */
  async refund(): Promise<number> {
    const amount = this.inserted;
    this.inserted = 0;
    return amount;
  }
}
