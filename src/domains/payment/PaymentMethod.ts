export type PaymentType = 'card' | 'cash';

export interface PaymentResult {
  ok: boolean;
  /* 현금 거스름돈 */
  change?: number;
  /* 에러 메시지 */
  error?: string;
}

export interface PaymentMethod {
  readonly type: PaymentType;

  /* 결제 준비 단계 (단말기 초기화, 현금 투입 슬롯 활성화 등) */
  start(): Promise<void>;

  /* 실제 결제 시도 */
  pay(amount: number): Promise<PaymentResult>;

  /* 결제 취소 */
  cancel(): Promise<void>;

  /* 현금 잔액 조회 */
  getBalance(): number;

  /* 현금만 사용하는 API */
  insert?(denomination: number): void;
  /** 선택적 환불: 현금은 잔액을 반환하고 0으로 초기화, 카드는 0 반환 */
  refund?(): Promise<number>;
}
