import type { CardGateway } from '@/domains/gateway/CardGateway';
import type { PaymentMethod } from '@/domains/payment/PaymentMethod';

export class CardPayment implements PaymentMethod {
  readonly type = 'card' as const;
  constructor(private gateway: CardGateway) {}
  private authId: string | null = null;

  async start() {
    this.authId = null;
  }

  getBalance() {
    return 0;
  }

  async pay(amount: number) {
    const pre = await this.gateway.preAuthorize(amount);
    if (!pre.ok || !pre.authId) return { ok: false, error: pre.error ?? '카드 승인 실패' };
    this.authId = pre.authId;
    const cap = await this.gateway.capture(pre.authId);
    if (!cap.ok) {
      await this.gateway.void(pre.authId);
      this.authId = null;
      return { ok: false, error: cap.error ?? '카드 매입 실패' };
    }
    this.authId = null;
    return { ok: true };
  }

  async cancel() {
    if (this.authId) {
      await this.gateway.void(this.authId);
      this.authId = null;
    }
  }

  async refund() {
    return 0;
  }
}
